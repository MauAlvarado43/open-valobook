import React, { memo } from 'react';
import { Group, Circle, Line, Rect } from 'react-konva';
import type { AbilityPlacement } from '@/types/strategy';
import { getAbilityDefinition, getAbilityDimension } from '@/lib/constants/abilityDefinitions';

interface AbilityShapeRendererProps {
  element: AbilityPlacement;
  isSelected: boolean;
  fillColor: string;
  sideColor: string;
}

export const AbilityShapeRenderer = memo(function AbilityShapeRenderer({
  element,
  isSelected,
  fillColor,
  sideColor
}: AbilityShapeRendererProps) {
  const def = getAbilityDefinition(element.abilityName || element.abilityIcon || '');

  return (
    <Group>
      {/* Smoke / Area Shape */}
      {(element.subType === 'smoke' || element.subType === 'area') && (
        <>
          <Circle
            radius={element.radius || (def ? getAbilityDimension(def, 'radius') : (element.subType === 'smoke' ? 50 : 80)) || 50}
            fill={fillColor}
            opacity={element.opacity || (element.subType === 'smoke' ? 0.4 : 0.3)}
            stroke={sideColor}
            strokeWidth={isSelected ? 3 : 2}
            dash={isSelected ? [5, 5] : undefined}
            perfectDrawEnabled={false}
            shadowForStrokeEnabled={false}
          />
          {element.subType === 'area' && def && getAbilityDimension(def, 'innerRadius') && (
            <Circle
              radius={element.innerRadius || getAbilityDimension(def, 'innerRadius') || 0}
              fill="transparent"
              stroke={sideColor}
              strokeWidth={isSelected ? 2 : 1}
              dash={[3, 3]}
              opacity={0.7}
              perfectDrawEnabled={false}
              shadowForStrokeEnabled={false}
            />
          )}
        </>
      )}

      {/* Wall / Path / Curved-Wall Shape */}
      {(element.subType === 'wall' || element.subType === 'path' || element.subType === 'curved-wall') && (
        <Group>
          {(() => {
            const pts = element.points || [0, 0, 300, 0];
            const tension = element.tension !== undefined ? element.tension : 0;
            const width = element.subType === 'path'
              ? (element.width || (def ? getAbilityDimension(def, 'width') : 80) || 80)
              : (element.width || (element.isGlobal ? 20 : (def ? getAbilityDimension(def, 'height') : 12) || 12));

            return (
              <>
                <Line
                  points={pts}
                  stroke={fillColor}
                  strokeWidth={width}
                  opacity={element.opacity || (element.subType === 'path' ? 0.15 : (element.isGlobal ? 0.3 : 0.25))}
                  lineCap="butt"
                  tension={tension}
                  shadowColor={element.isGlobal ? fillColor : undefined}
                  shadowBlur={element.isGlobal ? 15 : 0}
                  perfectDrawEnabled={false}
                  shadowForStrokeEnabled={false}
                  hitStrokeWidth={Math.max(25, width)}
                />
                <Line
                  points={pts}
                  stroke={sideColor}
                  strokeWidth={2}
                  opacity={0.5}
                  lineCap="butt"
                  tension={tension}
                  perfectDrawEnabled={false}
                  shadowForStrokeEnabled={false}
                />
                {element.subType === 'path' && (
                  <Line
                    points={pts}
                    stroke={fillColor}
                    strokeWidth={width + 8}
                    opacity={0.4}
                    lineCap="butt"
                    perfectDrawEnabled={false}
                    shadowForStrokeEnabled={false}
                    listening={false}
                  />
                )}
              </>
            );
          })()}
        </Group>
      )}

      {/* Background Icon Rect for specific types */}
      {element.subType === 'icon' && (
        <Rect
          width={44}
          height={44}
          x={-22}
          y={-22}
          fill={fillColor}
          opacity={element.opacity || 0.2}
          cornerRadius={8}
          perfectDrawEnabled={false}
        />
      )}

      {/* Guided-Path Trajectory */}
      {element.subType === 'guided-path' && element.guidedPoints && element.guidedPoints.length >= 4 && (
        <Group>
          <Line
            points={element.guidedPoints}
            stroke={fillColor}
            strokeWidth={6}
            opacity={0.6}
            lineCap="round"
            lineJoin="round"
            tension={0.4}
            perfectDrawEnabled={false}
          />
          <Line
            points={element.guidedPoints}
            stroke={sideColor}
            strokeWidth={8}
            opacity={0.3}
            lineCap="round"
            lineJoin="round"
            tension={0.4}
            perfectDrawEnabled={false}
            listening={false}
          />
          {/* Directional arrows */}
          {(() => {
            const arrows = [];
            for (let i = 0; i < element.guidedPoints.length - 2; i += 4) {
              const x1 = element.guidedPoints[i], y1 = element.guidedPoints[i + 1];
              const x2 = element.guidedPoints[i + 2], y2 = element.guidedPoints[i + 3];
              const angle = Math.atan2(y2 - y1, x2 - x1);
              arrows.push(
                <Line
                  key={`arrow-${i}`}
                  points={[-8, -4, 0, 0, -8, 4]}
                  stroke={sideColor}
                  strokeWidth={2}
                  lineCap="round"
                  lineJoin="round"
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2}
                  rotation={(angle * 180) / Math.PI}
                  perfectDrawEnabled={false}
                  listening={false}
                />
              );
            }
            return arrows;
          })()}
        </Group>
      )}
    </Group>
  );
});
