import { memo } from 'react';
import { Group, Line, Rect, Text as KonvaText } from 'react-konva';
import type { DrawingElement } from '@/types/strategy';

import { CanvasCommonProps } from '@/types/canvas';

interface TimerPathRendererProps {
  element: DrawingElement;
  commonProps: CanvasCommonProps;
}

const getPathDistance = (points: number[]): number => {
  let total = 0;
  for (let i = 0; i < points.length - 2; i += 2) {
    const dx = points[i + 2] - points[i];
    const dy = points[i + 3] - points[i + 1];
    total += Math.sqrt(dx * dx + dy * dy);
  }
  return total;
};

export const TimerPathRenderer = memo(function TimerPathRenderer({
  element,
  commonProps
}: TimerPathRendererProps) {
  const points = element.points || [0, 0];
  const distPx = getPathDistance(points);

  // Conversion factor: 1 pixel = 0.2 meters (approximate average)
  const meters = distPx * 0.2;

  // Speeds (m/s)
  const runSpeed = 6.73;
  const walkSpeed = 3.76;
  const crouchSpeed = 3.01;

  const runTime = meters / runSpeed;
  const walkTime = meters / walkSpeed;
  const crouchTime = meters / crouchSpeed;

  // Label positioning (end of path)
  const lastX = points[points.length - 2];
  const lastY = points[points.length - 1];

  return (
    <Group>
      <Line
        {...commonProps}
        points={points}
        lineCap="round"
        lineJoin="round"
        tension={0.5}
      />
      {points.length >= 4 && (
        <Group x={lastX} y={lastY + 10}>
          <Rect
            width={110}
            height={50}
            fill="#000000"
            opacity={0.8}
            cornerRadius={4}
            offsetX={55}
          />
          <KonvaText
            text={`Run: ${runTime.toFixed(1)}s\nWalk: ${walkTime.toFixed(1)}s\nCrouch: ${crouchTime.toFixed(1)}s`}
            fontSize={11}
            fill="#FFFFFF"
            align="center"
            width={110}
            offsetX={55}
            y={5}
          />
        </Group>
      )}
    </Group>
  );
});
