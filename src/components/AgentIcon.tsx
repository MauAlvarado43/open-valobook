import { memo } from 'react';
import { Group, Circle, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import type { AgentPlacement } from '@/types/strategy';
import type Konva from 'konva';

interface AgentIconProps {
  element: AgentPlacement;
  isSelected: boolean;
  isDraggable: boolean;
  onSelect: () => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
}

export const AgentIcon = memo(function AgentIcon({ element, isSelected, isDraggable, onSelect, onDragEnd }: AgentIconProps) {
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
      draggable={isDraggable}
      dragButtons={[0]}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      id={element.id}
      onMouseEnter={(e) => {
        if (isDraggable) {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = 'move';
        }
      }}
      onMouseLeave={(e) => {
        const stage = e.target.getStage();
        if (stage) stage.container().style.cursor = 'default';
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
        <Group clipFunc={(ctx) => {
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2, false);
          ctx.closePath();
          ctx.clip();
        }} listening={false}>
          <KonvaImage
            image={image}
            width={size}
            height={size}
            x={-radius}
            y={-radius}
          />
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
