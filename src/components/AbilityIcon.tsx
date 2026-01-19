import { memo } from 'react';
import { Group, Rect, Image as KonvaImage, Circle, Line } from 'react-konva';
import useImage from 'use-image';
import { useEditorStore } from '@/lib/store/editorStore';
import { getAgentColor } from '@/lib/constants/agentColors';
import { getAbilityDefinition, getAbilityDimension, getMaxDimension, getMinDimension, isFixedSize } from '@/lib/constants/abilityDefinitions';
import type { AbilityPlacement } from '@/types/strategy';
import type Konva from 'konva';

interface AbilityIconProps {
  element: AbilityPlacement;
  isSelected: boolean;
  isDraggable: boolean;
  onSelect: () => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
}

export const AbilityIcon = memo(function AbilityIcon({ element, isSelected, isDraggable, onSelect, onDragEnd }: AbilityIconProps) {
  const { updateElement, tool } = useEditorStore();
  // Ability icon path: /assets/{abilityIcon}
  const iconUrl = `/assets/${element.abilityIcon}`;
  const [image, status] = useImage(iconUrl);

  const size = 32;
  const padding = 4;

  // Ring/Stroke color based on side
  const sideColor = element.side === 'attack' ? '#FF4655' : '#00D4FF';

  const handleResize = (e: Konva.KonvaEventObject<DragEvent>, type: 'radius' | 'wall-start' | 'wall-end' | 'rect-size' | `curved-point-${number}`) => {
    e.cancelBubble = true;
    const stage = e.target.getStage();
    if (!stage) return;

    // Position of the handle relative to the group center (element.x, element.y)
    const handlePos = { x: e.target.x(), y: e.target.y() };

    if (type === 'radius') {
      let radius = Math.sqrt(handlePos.x * handlePos.x + handlePos.y * handlePos.y);
      const max = getMaxDimension(def, 'radius');
      radius = Math.min(radius, max);
      updateElement(element.id, { radius });
    } else if (type === 'wall-start') {
      // Calculate distance from end point
      const endX = element.points![2];
      const endY = element.points![3];
      const dx = handlePos.x - endX;
      const dy = handlePos.y - endY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Get maximum and minimum allowed distance
      // Paths use height for length, walls use width for length
      const isPath = element.subType === 'path';
      const maxDist = getMaxDimension(def, isPath ? 'height' : 'width');
      const minDist = getMinDimension(def, isPath ? 'height' : 'width');

      // Clamp position between min and max
      let newX = handlePos.x;
      let newY = handlePos.y;
      if (distance > maxDist) {
        const ratio = maxDist / distance;
        newX = endX + dx * ratio;
        newY = endY + dy * ratio;
      } else if (distance < minDist) {
        const ratio = minDist / distance;
        newX = endX + dx * ratio;
        newY = endY + dy * ratio;
      }

      const points = [newX, newY, element.points![2], element.points![3]];
      updateElement(element.id, { points });
    } else if (type === 'wall-end') {
      // Calculate distance from start point
      const startX = element.points![0];
      const startY = element.points![1];
      const dx = handlePos.x - startX;
      const dy = handlePos.y - startY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Get maximum and minimum allowed distance
      // Paths use height for length, walls use width for length
      const isPath = element.subType === 'path';
      const maxDist = getMaxDimension(def, isPath ? 'height' : 'width');
      const minDist = getMinDimension(def, isPath ? 'height' : 'width');

      // Clamp position between min and max
      let newX = handlePos.x;
      let newY = handlePos.y;
      if (distance > maxDist) {
        const ratio = maxDist / distance;
        newX = startX + dx * ratio;
        newY = startY + dy * ratio;
      } else if (distance < minDist) {
        const ratio = minDist / distance;
        newX = startX + dx * ratio;
        newY = startY + dy * ratio;
      }

      const points = [element.points![0], element.points![1], newX, newY];
      updateElement(element.id, { points });
    } else if (type.startsWith('curved-point-')) {
      // Handle curved-wall intermediate points
      const pointIndex = parseInt(type.split('-')[2]);
      const newPoints = [...element.points!];
      const arrayIndex = pointIndex * 2;

      // Update the point being dragged
      newPoints[arrayIndex] = handlePos.x;
      newPoints[arrayIndex + 1] = handlePos.y;

      // Calculate total path length (sum of distances between consecutive points)
      let totalLength = 0;
      for (let i = 0; i < newPoints.length - 2; i += 2) {
        const dx = newPoints[i + 2] - newPoints[i];
        const dy = newPoints[i + 3] - newPoints[i + 1];
        totalLength += Math.sqrt(dx * dx + dy * dy);
      }

      // Get maximum allowed total length
      // Curved-walls always use width for distance
      const maxDist = getMaxDimension(def, 'width');

      // If total length exceeds max, find the closest valid position
      if (totalLength > maxDist) {
        // Binary search to find the maximum allowed position
        const originalX = element.points![arrayIndex];
        const originalY = element.points![arrayIndex + 1];
        const targetX = handlePos.x;
        const targetY = handlePos.y;

        let low = 0;
        let high = 1;
        let bestRatio = 0;

        // Binary search for the best ratio
        for (let i = 0; i < 20; i++) {
          const mid = (low + high) / 2;
          const testX = originalX + (targetX - originalX) * mid;
          const testY = originalY + (targetY - originalY) * mid;

          // Calculate total length with this test position
          const testPoints = [...newPoints];
          testPoints[arrayIndex] = testX;
          testPoints[arrayIndex + 1] = testY;

          let testLength = 0;
          for (let j = 0; j < testPoints.length - 2; j += 2) {
            const dx = testPoints[j + 2] - testPoints[j];
            const dy = testPoints[j + 3] - testPoints[j + 1];
            testLength += Math.sqrt(dx * dx + dy * dy);
          }

          if (testLength <= maxDist) {
            bestRatio = mid;
            low = mid;
          } else {
            high = mid;
          }
        }

        // Apply the best ratio found
        newPoints[arrayIndex] = originalX + (targetX - originalX) * bestRatio;
        newPoints[arrayIndex + 1] = originalY + (targetY - originalY) * bestRatio;
      }

      updateElement(element.id, { points: newPoints });
    } else if (type === 'rect-size') {
      // Offset from center
      let width = Math.abs(handlePos.x) * 2;
      let height = Math.abs(handlePos.y) * 2;
      const maxW = getMaxDimension(def, 'width');
      const maxH = getMaxDimension(def, 'height');
      width = Math.min(width, maxW);
      height = Math.min(height, maxH);
      updateElement(element.id, { width, height });
    }
  };


  const isSelectTool = tool === 'select';

  // Robust definition lookup with legacy support
  const def = getAbilityDefinition(element.abilityName || element.abilityIcon || '');

  const rectWidth = element.width || (def ? getAbilityDimension(def, 'width') : 200) || 200;
  const rectHeight = element.height || (def ? getAbilityDimension(def, 'height') : 120) || 120;

  // Try to derive color from icon path if not explicitly stored (for legacy elements)
  let derivedColor = element.color;
  if (!derivedColor && element.abilityIcon) {
    const parts = element.abilityIcon.split('/');
    if (parts.length >= 2) {
      const agentName = parts[1]; // e.g. 'abilities/omen/icon.png' -> 'omen'
      derivedColor = getAgentColor(agentName);
    }
  }

  const fillColor = derivedColor || sideColor;

  return (
    <Group
      x={element.x}
      y={element.y}
      rotation={element.rotation || 0}
      scaleX={element.scaleX || 1}
      scaleY={element.scaleY || 1}
      draggable={isDraggable && isSelectTool}
      dragButtons={[0]}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      id={element.id}
      onMouseEnter={(e) => {
        if (isDraggable && isSelectTool) {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = 'move';
        }
      }}
      onMouseLeave={(e) => {
        const stage = e.target.getStage();
        if (stage) stage.container().style.cursor = 'default';
      }}
    >
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
          {/* Inner radius circle for dual-radius areas (e.g., Alarmbot) */}
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
            return (
              <>
                {/* Main wall/path body */}
                <Line
                  points={pts}
                  stroke={fillColor}
                  strokeWidth={element.subType === 'path' ? (element.width || (def ? getAbilityDimension(def, 'width') : 80) || 80) : (element.width || (element.isGlobal ? 20 : (def ? getAbilityDimension(def, 'height') : 12) || 12))}
                  opacity={element.opacity || (element.subType === 'path' ? 0.15 : (element.isGlobal ? 0.3 : 0.25))}
                  lineCap="butt"
                  tension={tension}
                  shadowColor={element.isGlobal ? fillColor : undefined}
                  shadowBlur={element.isGlobal ? 15 : 0}
                  perfectDrawEnabled={false}
                  shadowForStrokeEnabled={false}
                  hitStrokeWidth={Math.max(25, element.width || 0)}
                />
                {/* Team side border/indicator */}
                <Line
                  points={pts}
                  stroke={sideColor}
                  strokeWidth={2}
                  opacity={0.5}
                  lineCap="butt"
                  tension={tension}
                  perfectDrawEnabled={false}
                  shadowForStrokeEnabled={false}
                  hitStrokeWidth={Math.max(25, element.width || 0)}
                />
                {/* Colored border for paths */}
                {element.subType === 'path' && (
                  <Line
                    points={pts}
                    stroke={fillColor}
                    strokeWidth={(element.width || 80) + 8}
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

      {/* Icon fallback or explicit 'icon' type */}
      {element.subType === 'icon' && (
        <Rect
          width={size + 12}
          height={size + 12}
          x={-size / 2 - 6}
          y={-size / 2 - 6}
          fill={fillColor}
          opacity={element.opacity || 0.2}
          cornerRadius={8}
          perfectDrawEnabled={false}
        />
      )}
      {/* Legacy/Other Rect support */}
      {element.subType === 'rect' && (
        <Rect
          width={rectWidth}
          height={rectHeight}
          x={-rectWidth / 2}
          y={-rectHeight / 2}
          fill={fillColor}
          opacity={0.3}
          stroke={sideColor}
          strokeWidth={isSelected ? 3 : 2}
          dash={isSelected ? [5, 5] : undefined}
          cornerRadius={4}
          perfectDrawEnabled={false}
          shadowForStrokeEnabled={false}
        />
      )}

      {/* Background Icon Rect (The black square) */}
      <Rect
        width={size}
        height={size}
        x={-size / 2}
        y={-size / 2}
        fill="#111827"
        opacity={element.isGlobal ? 0.4 : 1}
        cornerRadius={6}
        stroke={isSelected ? '#FFFFFF' : sideColor}
        strokeWidth={isSelected ? 3 : 2}
        shadowBlur={isSelected ? 10 : 2}
        shadowOpacity={0.5}
        perfectDrawEnabled={false}
        shadowForStrokeEnabled={false}
      />

      {/* Ability Icon */}
      {status === 'loaded' && (
        <KonvaImage
          image={image}
          width={size - padding * 2}
          height={size - padding * 2}
          x={-size / 2 + padding}
          y={-size / 2 + padding}
          listening={false}
        />
      )}

      {/* Loading Placeholder */}
      {status === 'loading' && (
        <Rect
          width={size - padding * 2}
          height={size - padding * 2}
          x={-size / 2 + padding}
          y={-size / 2 + padding}
          fill="#374151"
          cornerRadius={4}
          listening={false}
        />
      )}

      {/* Guided-Path Shape (Free-form trajectory) - Path and Arrows */}
      {element.subType === 'guided-path' && element.guidedPoints && element.guidedPoints.length >= 4 && (
        <Group>
          {/* Smooth path line */}
          <Line
            points={element.guidedPoints}
            stroke={fillColor}
            strokeWidth={6}
            opacity={0.6}
            lineCap="round"
            lineJoin="round"
            tension={0.4}
            perfectDrawEnabled={false}
            shadowForStrokeEnabled={false}
          />
          {/* Border/outline */}
          <Line
            points={element.guidedPoints}
            stroke={sideColor}
            strokeWidth={8}
            opacity={0.3}
            lineCap="round"
            lineJoin="round"
            tension={0.4}
            perfectDrawEnabled={false}
            shadowForStrokeEnabled={false}
            listening={false}
          />
          {/* Directional arrows along the path */}
          {(() => {
            const arrows = [];
            for (let i = 0; i < element.guidedPoints.length - 2; i += 4) {
              const x1 = element.guidedPoints[i];
              const y1 = element.guidedPoints[i + 1];
              const x2 = element.guidedPoints[i + 2];
              const y2 = element.guidedPoints[i + 3];
              const angle = Math.atan2(y2 - y1, x2 - x1);
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

              arrows.push(
                <Line
                  key={`arrow-${i}`}
                  points={[
                    -8, -4,
                    0, 0,
                    -8, 4
                  ]}
                  stroke={sideColor}
                  strokeWidth={2}
                  lineCap="round"
                  lineJoin="round"
                  x={midX}
                  y={midY}
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

      {/* Selection & Transformation UI */}
      {isSelected && isSelectTool && (
        <>
          {/* Resize Handles */}
          {(element.subType === 'smoke' || element.subType === 'area') && !isFixedSize(def, 'radius') && (
            <Circle
              key={`${element.id}-radius-handle`}
              name="edit-handle"
              x={element.radius || (element.subType === 'smoke' ? 50 : 80)}
              y={0}
              radius={8}
              fill="white"
              stroke="#3b82f6"
              strokeWidth={2}
              draggable
              onMouseEnter={(e) => {
                const stage = e.target.getStage();
                if (stage) stage.container().style.cursor = 'ew-resize';
              }}
              onMouseLeave={(e) => {
                const stage = e.target.getStage();
                if (stage) stage.container().style.cursor = 'default';
              }}
              onDragStart={(e) => { e.cancelBubble = true; }}
              onDragMove={(e) => handleResize(e, 'radius')}
              onDragEnd={(e) => { e.cancelBubble = true; }}
            />
          )}
          {(element.subType === 'wall' || element.subType === 'path') && element.points && (
            <Group key={`${element.id}-wall-handles`}>
              {/* End Point (Always editable) */}
              <Circle
                key={`${element.id}-wall-end`}
                name="edit-handle"
                x={element.points[2]}
                y={element.points[3]}
                radius={8}
                fill="white"
                stroke="#3b82f6"
                strokeWidth={2}
                draggable
                onMouseEnter={(e) => {
                  const stage = e.target.getStage();
                  if (stage) stage.container().style.cursor = 'move';
                }}
                onMouseLeave={(e) => {
                  const stage = e.target.getStage();
                  if (stage) stage.container().style.cursor = 'default';
                }}
                onDragStart={(e) => { e.cancelBubble = true; }}
                onDragMove={(e) => handleResize(e, 'wall-end')}
                onDragEnd={(e) => { e.cancelBubble = true; }}
              />
            </Group>
          )}
          {/* Curved-wall handles - all points are editable */}
          {element.subType === 'curved-wall' && element.points && element.points.length >= 4 && (
            <Group key={`${element.id}-curved-handles`}>
              {(() => {
                const handles = [];
                // Create handle for each point (skip first, it's the icon position)
                for (let i = 2; i < element.points.length; i += 2) {
                  const pointIndex = i / 2;
                  handles.push(
                    <Circle
                      key={`${element.id}-point-${pointIndex}`}
                      name="edit-handle"
                      x={element.points[i]}
                      y={element.points[i + 1]}
                      radius={7}
                      fill="white"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      draggable
                      onMouseEnter={(e) => {
                        const stage = e.target.getStage();
                        if (stage) stage.container().style.cursor = 'move';
                      }}
                      onMouseLeave={(e) => {
                        const stage = e.target.getStage();
                        if (stage) stage.container().style.cursor = 'default';
                      }}
                      onDragStart={(e) => { e.cancelBubble = true; }}
                      onDragMove={(e) => handleResize(e, `curved-point-${pointIndex}`)}
                      onDragEnd={(e) => { e.cancelBubble = true; }}
                    />
                  );
                }
                return handles;
              })()}
            </Group>
          )}
          {element.subType === 'rect' && (
            <Circle
              key={`${element.id}-rect-handle`}
              name="edit-handle"
              x={rectWidth / 2}
              y={rectHeight / 2}
              radius={8}
              fill="white"
              stroke="#3b82f6"
              strokeWidth={2}
              draggable
              onMouseEnter={(e) => {
                const stage = e.target.getStage();
                if (stage) stage.container().style.cursor = 'nwse-resize';
              }}
              onMouseLeave={(e) => {
                const stage = e.target.getStage();
                if (stage) stage.container().style.cursor = 'default';
              }}
              onDragStart={(e) => { e.cancelBubble = true; }}
              onDragMove={(e) => handleResize(e, 'rect-size')}
              onDragEnd={(e) => { e.cancelBubble = true; }}
            />
          )}

          {/* Guided-path handles - show 4 corners when no path exists */}
          {element.subType === 'guided-path' && (!element.guidedPoints || element.guidedPoints.length < 4) && (
            <>
              {/* Top center */}
              <Circle
                key={`${element.id}-handle-top`}
                name="guided-handle"
                x={0}
                y={-size / 2}
                radius={5}
                fill="white"
                stroke={sideColor}
                strokeWidth={2}
                listening={false}
                perfectDrawEnabled={false}
              />
              {/* Right center */}
              <Circle
                key={`${element.id}-handle-right`}
                name="guided-handle"
                x={size / 2}
                y={0}
                radius={5}
                fill="white"
                stroke={sideColor}
                strokeWidth={2}
                listening={false}
                perfectDrawEnabled={false}
              />
              {/* Bottom center */}
              <Circle
                key={`${element.id}-handle-bottom`}
                name="guided-handle"
                x={0}
                y={size / 2}
                radius={5}
                fill="white"
                stroke={sideColor}
                strokeWidth={2}
                listening={false}
                perfectDrawEnabled={false}
              />
              {/* Left center */}
              <Circle
                key={`${element.id}-handle-left`}
                name="guided-handle"
                x={-size / 2}
                y={0}
                radius={5}
                fill="white"
                stroke={sideColor}
                strokeWidth={2}
                listening={false}
                perfectDrawEnabled={false}
              />
            </>
          )}
        </>
      )
      }
    </Group >
  );
});
