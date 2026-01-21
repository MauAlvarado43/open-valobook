import { memo } from 'react';
import { Group, Circle, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import type { AgentPlacement } from '@/types/strategy';
import type Konva from 'konva';

interface AgentIconProps {
  element: AgentPlacement;
  isSelected: boolean;
  isDraggable: boolean;
  onSelect: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  rotationOffset?: number;
}

export const AgentIcon = memo(function AgentIcon({
  element,
  isSelected,
  isDraggable,
  onSelect,
  onDragEnd,
  rotationOffset = 0,
}: AgentIconProps) {
  // Agent icon path: /assets/agents/{agentName}.png
  const iconUrl = `/assets/${element.agentId}.png`;
  const [image, status] = useImage(iconUrl);

  const size = 35;
  const radius = size / 2;

  // Ring color based on side
  const borderColor = element.side === 'attack' ? '#FF4655' : '#00D4FF';

  return (
    <Group
      x={element.x}
      y={element.y}
      rotation={-rotationOffset}
      draggable={isDraggable}
      dragButtons={[0]}
      onMouseDown={(e) => {
        // Middle button: start Stage drag for panning
        if (e.evt.button === 1) {
          const stage = e.target.getStage();
          if (stage) {
            const container = stage.container();
            container.style.cursor = 'grabbing';
            if (container.parentElement) {
              container.parentElement.style.cursor = 'grabbing';
            }
            stage.startDrag();
          }
          return;
        }
        onSelect(e);
      }}
      onTap={(e) => onSelect(e as any)}
      onDragEnd={onDragEnd}
      onDragStart={(e) => {
        // Stop drag if Shift is held (for multi-select) or right-click
        if (e.evt.shiftKey || e.evt.button === 2) {
          e.target.stopDrag();
        }
        // If middle button, stop element drag but DON'T cancel bubble so Stage can pan
        if (e.evt.button === 1) {
          e.target.stopDrag();
        }
      }}
      onContextMenu={(e) => {
        e.evt.preventDefault();
        onSelect(e);
      }}
      id={element.id}
      onMouseEnter={(e) => {
        if (isDraggable && e.evt.buttons === 0) {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = 'move';
        }
      }}
      onMouseLeave={(e) => {
        if (e.evt.buttons === 0) {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = 'default';
        }
      }}
    >
      {/* Background/Shadow */}
      <Circle
        radius={radius + 4}
        fill="rgba(0, 0, 0, 0.4)"
        shadowBlur={isSelected ? 10 : 5}
        shadowColor="black"
        shadowOpacity={0.6}
        perfectDrawEnabled={false}
        listening={false}
      />

      {/* Side Color Ring */}
      <Circle
        radius={radius + 2}
        stroke={borderColor}
        strokeWidth={3}
        fill="#1f2937" // gray-800
        perfectDrawEnabled={false}
        shadowForStrokeEnabled={false}
      />

      {/* Selection Highlight */}
      {isSelected && (
        <Circle
          radius={radius + 6}
          stroke="#FFFFFF"
          strokeWidth={2}
          dash={[5, 5]}
          perfectDrawEnabled={false}
          listening={false}
        />
      )}

      {/* Agent Icon */}
      {status === 'loaded' && (
        <Group
          clipFunc={(ctx) => {
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.clip();
          }}
          listening={false}
        >
          <KonvaImage image={image} width={size} height={size} x={-radius} y={-radius} />
        </Group>
      )}

      {/* Loading Placeholder */}
      {status === 'loading' && (
        <Circle
          radius={radius}
          fill="#374151" // gray-700
          perfectDrawEnabled={false}
          listening={false}
        />
      )}
    </Group>
  );
});
