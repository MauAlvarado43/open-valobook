import { memo } from 'react';
import { Group, Rect, Image as KonvaImage, Circle } from 'react-konva';
import useImage from 'use-image';
import { useEditorStore } from '@/lib/store/editorStore';
import { getAgentColor } from '@/lib/constants/agentColors';
import {
  getAbilityDefinition,
  getMaxDimension,
  getMinDimension,
  isFixedSize,
} from '@/lib/constants/abilityDefinitions';
import type { AbilityPlacement } from '@/types/strategy';
import type Konva from 'konva';
import { AbilityShapeRenderer } from '@/components/canvas/abilities/AbilityShapeRenderer';

interface AbilityIconProps {
  element: AbilityPlacement;
  isSelected: boolean;
  isDraggable: boolean;
  onSelect: () => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  rotationOffset?: number;
}

export const AbilityIcon = memo(function AbilityIcon({
  element,
  isSelected,
  isDraggable,
  onSelect,
  onDragEnd,
  rotationOffset = 0,
}: AbilityIconProps) {
  const { updateElement, tool } = useEditorStore();
  const iconUrl = `/assets/${element.abilityIcon}`;
  const [image, status] = useImage(iconUrl);

  const size = 32;
  const padding = 4;
  const sideColor = element.side === 'attack' ? '#FF4655' : '#00D4FF';
  const def = getAbilityDefinition(element.abilityName || element.abilityIcon || '');

  const handleResize = (
    e: Konva.KonvaEventObject<DragEvent>,
    type: 'radius' | 'wall-start' | 'wall-end' | 'rect-size' | `curved-point-${number}`
  ) => {
    e.cancelBubble = true;
    const handlePos = { x: e.target.x(), y: e.target.y() };

    if (type === 'radius') {
      const radius = Math.sqrt(handlePos.x * handlePos.x + handlePos.y * handlePos.y);
      updateElement(element.id, { radius: Math.min(radius, getMaxDimension(def, 'radius')) });
    } else if (type === 'wall-start' || type === 'wall-end') {
      const isStart = type === 'wall-start';
      const anchorIdx = isStart ? 2 : 0;
      const moveIdx = isStart ? 0 : 2;
      const ax = element.points![anchorIdx],
        ay = element.points![anchorIdx + 1];
      const dx = handlePos.x - ax,
        dy = handlePos.y - ay;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const isPath = element.subType === 'path';
      const maxDist = getMaxDimension(def, isPath ? 'height' : 'width');
      const minDist = getMinDimension(def, isPath ? 'height' : 'width');

      let newX = handlePos.x,
        newY = handlePos.y;
      if (distance > maxDist || distance < minDist) {
        const ratio = (distance > maxDist ? maxDist : minDist) / distance;
        newX = ax + dx * ratio;
        newY = ay + dy * ratio;
      }
      const newPoints = [...element.points!];
      newPoints[moveIdx] = newX;
      newPoints[moveIdx + 1] = newY;
      updateElement(element.id, { points: newPoints });
    } else if (type.startsWith('curved-point-')) {
      const pointIndex = parseInt(type.split('-')[2]);
      const newPoints = [...element.points!];
      const arrayIndex = pointIndex * 2;
      newPoints[arrayIndex] = handlePos.x;
      newPoints[arrayIndex + 1] = handlePos.y;

      let totalLength = 0;
      for (let i = 0; i < newPoints.length - 2; i += 2) {
        totalLength += Math.sqrt(
          Math.pow(newPoints[i + 2] - newPoints[i], 2) +
            Math.pow(newPoints[i + 3] - newPoints[i + 1], 2)
        );
      }

      const maxDist = getMaxDimension(def, 'width');
      if (totalLength > maxDist) {
        // Simple clamp toward original point if total length exceeds
        const ox = element.points![arrayIndex],
          oy = element.points![arrayIndex + 1];
        const tx = handlePos.x,
          ty = handlePos.y;
        let low = 0,
          high = 1;
        for (let i = 0; i < 10; i++) {
          const mid = (low + high) / 2;
          const testX = ox + (tx - ox) * mid,
            testY = oy + (ty - oy) * mid;
          const testPoints = [...newPoints];
          testPoints[arrayIndex] = testX;
          testPoints[arrayIndex + 1] = testY;
          let testLen = 0;
          for (let j = 0; j < testPoints.length - 2; j += 2) {
            testLen += Math.sqrt(
              Math.pow(testPoints[j + 2] - testPoints[j], 2) +
                Math.pow(testPoints[j + 3] - testPoints[j + 1], 2)
            );
          }
          if (testLen <= maxDist) low = mid;
          else high = mid;
        }
        newPoints[arrayIndex] = ox + (tx - ox) * low;
        newPoints[arrayIndex + 1] = oy + (ty - oy) * low;
      }
      updateElement(element.id, { points: newPoints });
    } else if (type === 'rect-size') {
      updateElement(element.id, {
        width: Math.min(Math.abs(handlePos.x) * 2, getMaxDimension(def, 'width')),
        height: Math.min(Math.abs(handlePos.y) * 2, getMaxDimension(def, 'height')),
      });
    }
  };

  let derivedColor = element.color;
  if (!derivedColor && element.abilityIcon) {
    const parts = element.abilityIcon.split('/');
    if (parts.length >= 2) derivedColor = getAgentColor(parts[1]);
  }
  const fillColor = derivedColor || sideColor;
  const isSelectTool = tool === 'select';

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
      onDragStart={(e) => {
        if (e.evt.button !== 0) {
          e.target.stopDrag();
        }
      }}
      onContextMenu={(e) => {
        e.evt.preventDefault();
        onSelect();
      }}
      id={element.id}
      onMouseEnter={(e) => {
        if (isDraggable && isSelectTool && e.evt.buttons === 0)
          (e.target.getStage() as Konva.Stage).container().style.cursor = 'move';
      }}
      onMouseLeave={(e) => {
        if (e.evt.buttons === 0)
          (e.target.getStage() as Konva.Stage).container().style.cursor = 'default';
      }}
    >
      <AbilityShapeRenderer
        element={element}
        isSelected={isSelected}
        fillColor={fillColor}
        sideColor={sideColor}
      />

      {/* Billboard the Icon Box */}
      <Group rotation={-rotationOffset}>
        {/* Core Icon Box */}
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
          perfectDrawEnabled={false}
        />

        {status === 'loaded' ? (
          <KonvaImage
            image={image}
            width={size - padding * 2}
            height={size - padding * 2}
            x={-size / 2 + padding}
            y={-size / 2 + padding}
            listening={false}
          />
        ) : (
          status === 'loading' && (
            <Rect
              width={size - padding * 2}
              height={size - padding * 2}
              x={-size / 2 + padding}
              y={-size / 2 + padding}
              fill="#374151"
              cornerRadius={4}
              listening={false}
            />
          )
        )}
      </Group>

      {/* Transformation Handles */}
      {isSelected && isSelectTool && (
        <>
          {/* Re-using raw Konva Circles for these specialized drags with proper event handling */}
          {(element.subType === 'smoke' || element.subType === 'area') &&
            !isFixedSize(def, 'radius') && (
              <Circle
                x={element.radius || 60}
                y={0}
                radius={8}
                fill="white"
                stroke="#3b82f6"
                strokeWidth={2}
                draggable
                dragButtons={[0]}
                onDragMove={(e) => handleResize(e, 'radius')}
                onDragStart={(e) => (e.cancelBubble = true)}
                onDragEnd={(e) => (e.cancelBubble = true)}
                onMouseEnter={(e) => {
                  const stage = e.target.getStage();
                  if (stage) stage.container().style.cursor = 'ew-resize';
                }}
                onMouseLeave={(e) => {
                  const stage = e.target.getStage();
                  if (stage) stage.container().style.cursor = 'default';
                }}
              />
            )}

          {(element.subType === 'wall' || element.subType === 'path') && element.points && (
            <Circle
              x={element.points[2]}
              y={element.points[3]}
              radius={8}
              fill="white"
              stroke="#3b82f6"
              strokeWidth={2}
              draggable
              dragButtons={[0]}
              onDragMove={(e) => handleResize(e, 'wall-end')}
              onDragStart={(e) => (e.cancelBubble = true)}
              onDragEnd={(e) => (e.cancelBubble = true)}
              onMouseEnter={(e) => {
                const stage = e.target.getStage();
                if (stage) stage.container().style.cursor = 'move';
              }}
              onMouseLeave={(e) => {
                const stage = e.target.getStage();
                if (stage) stage.container().style.cursor = 'default';
              }}
            />
          )}

          {element.subType === 'curved-wall' &&
            element.points &&
            element.points.slice(2).reduce<JSX.Element[]>((acc, _, i, arr) => {
              if (i % 2 === 0) {
                const idx = (i + 2) / 2;
                acc.push(
                  <Circle
                    key={idx}
                    x={arr[i]}
                    y={arr[i + 1]}
                    radius={7}
                    fill="white"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    draggable
                    dragButtons={[0]}
                    onDragMove={(e) => handleResize(e, `curved-point-${idx}`)}
                    onDragStart={(e) => (e.cancelBubble = true)}
                    onDragEnd={(e) => (e.cancelBubble = true)}
                    onMouseEnter={(e) => {
                      const stage = e.target.getStage();
                      if (stage) stage.container().style.cursor = 'move';
                    }}
                    onMouseLeave={(e) => {
                      const stage = e.target.getStage();
                      if (stage) stage.container().style.cursor = 'default';
                    }}
                  />
                );
              }
              return acc;
            }, [])}

          {element.subType === 'rect' && (
            <Circle
              x={element.width ? element.width / 2 : 50}
              y={element.height ? element.height / 2 : 50}
              radius={8}
              fill="white"
              stroke="#3b82f6"
              strokeWidth={2}
              draggable
              dragButtons={[0]}
              onDragMove={(e) => handleResize(e, 'rect-size')}
              onDragStart={(e) => (e.cancelBubble = true)}
              onDragEnd={(e) => (e.cancelBubble = true)}
              onMouseEnter={(e) => {
                const stage = e.target.getStage();
                if (stage) stage.container().style.cursor = 'nwse-resize';
              }}
              onMouseLeave={(e) => {
                const stage = e.target.getStage();
                if (stage) stage.container().style.cursor = 'default';
              }}
            />
          )}
        </>
      )}
    </Group>
  );
});
