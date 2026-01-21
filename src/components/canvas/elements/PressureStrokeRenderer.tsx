import { memo } from 'react';
import { Line, Group } from 'react-konva';
import type { DrawingElement } from '@/types/strategy';

interface PressureStrokeRendererProps {
  element: DrawingElement;
  commonProps: Record<string, unknown>;
}

/**
 * Renders a freehand stroke with variable width based on pressure data.
 * If no pressure data is available, falls back to uniform stroke width.
 *
 * Uses segmented rendering where each segment between points has its own
 * stroke width calculated from the average pressure of its endpoints.
 */
export const PressureStrokeRenderer = memo(function PressureStrokeRenderer({
  element,
  commonProps,
}: PressureStrokeRendererProps) {
  const points = element.points || [0, 0];
  const pressurePoints = element.pressurePoints;
  const baseStrokeWidth = element.strokeWidth || 2;

  // If no pressure data or not enough points, render simple line
  if (!pressurePoints || pressurePoints.length < 2 || points.length < 4) {
    return <Line {...commonProps} points={points} lineCap="round" lineJoin="round" tension={0.5} />;
  }

  // Configuration for pressure-to-width mapping
  const minWidthMultiplier = 0.3;
  const maxWidthMultiplier = 2.0;

  /**
   * Calculate stroke width from pressure value
   */
  const pressureToWidth = (pressure: number): number => {
    const range = maxWidthMultiplier - minWidthMultiplier;
    return baseStrokeWidth * (minWidthMultiplier + pressure * range);
  };

  // Generate segments with variable width
  const segments: Array<{
    points: number[];
    strokeWidth: number;
    key: string;
  }> = [];

  // Each pair of consecutive points forms a segment
  const numPoints = points.length / 2;

  for (let i = 0; i < numPoints - 1; i++) {
    const x1 = points[i * 2];
    const y1 = points[i * 2 + 1];
    const x2 = points[(i + 1) * 2];
    const y2 = points[(i + 1) * 2 + 1];

    // Get pressure for this segment (average of both endpoints)
    const p1 = pressurePoints[i] ?? 0.5;
    const p2 = pressurePoints[i + 1] ?? 0.5;
    const avgPressure = (p1 + p2) / 2;

    segments.push({
      points: [x1, y1, x2, y2],
      strokeWidth: pressureToWidth(avgPressure),
      key: `${element.id}-seg-${i}`,
    });
  }

  // Render each segment with its calculated width
  return (
    <Group>
      {segments.map((segment) => (
        <Line
          key={segment.key}
          {...commonProps}
          points={segment.points}
          strokeWidth={segment.strokeWidth}
          lineCap="round"
          lineJoin="round"
        />
      ))}
    </Group>
  );
});

/**
 * Type guard to check if an element has pressure data
 */
export function hasPressureData(element: DrawingElement): boolean {
  return !!(
    element.pressurePoints &&
    element.pressurePoints.length > 0 &&
    // Check if any pressure value is not the default 0.5
    element.pressurePoints.some((p) => p !== 0.5)
  );
}
