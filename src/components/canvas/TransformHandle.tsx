import { Circle } from 'react-konva';
import type Konva from 'konva';

interface TransformHandleProps {
  x: number;
  y: number;
  radius?: number;
  fill?: string;
  stroke?: string;
  cursor?: string;
  onMouseDown: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

export function TransformHandle({
  x,
  y,
  radius = 8,
  fill = 'white',
  stroke = '#3b82f6',
  cursor = 'move',
  onMouseDown
}: TransformHandleProps) {
  return (
    <Circle
      name="edit-handle"
      x={x}
      y={y}
      radius={radius}
      fill={fill}
      stroke={stroke}
      strokeWidth={2}
      draggable={false}
      onMouseDown={onMouseDown}
      onMouseEnter={(e) => {
        const stage = e.target.getStage();
        if (stage) stage.container().style.cursor = cursor;
      }}
      onMouseLeave={(e) => {
        const stage = e.target.getStage();
        if (stage) stage.container().style.cursor = 'default';
      }}
      perfectDrawEnabled={false}
    />
  );
}
