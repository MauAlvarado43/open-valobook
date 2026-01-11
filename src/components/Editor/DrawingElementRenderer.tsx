'use client';

import { useState } from 'react';
import { Line, Arrow, Circle as KonvaCircle, Rect, Text as KonvaText } from 'react-konva';
import type { DrawingElement } from '@/types/strategy';
import type Konva from 'konva';

interface DrawingElementRendererProps {
  element: DrawingElement;
  isSelected: boolean;
  isDraggable?: boolean;
  showHover?: boolean;
  onSelect: () => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onTextEdit?: (newText: string) => void;
}

export function DrawingElementRenderer({
  element,
  isSelected,
  isDraggable = true,
  showHover = true,
  onSelect,
  onDragEnd,
}: DrawingElementRendererProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const commonProps = {
    id: element.id,
    x: element.x,
    y: element.y,
    draggable: isDraggable,
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd,
    onMouseEnter: (e: Konva.KonvaEventObject<MouseEvent>) => {
      setIsHovered(true);
      const container = e.target.getStage()?.container();
      if (container) container.style.cursor = 'pointer';
    },
    onMouseLeave: (e: Konva.KonvaEventObject<MouseEvent>) => {
      setIsHovered(false);
      const container = e.target.getStage()?.container();
      if (container) container.style.cursor = 'default';
    },
    stroke: element.color || '#FF4655',
    strokeWidth: element.strokeWidth || 2,
    rotation: element.rotation || 0,
    scaleX: element.scaleX || 1,
    scaleY: element.scaleY || 1,
    shadowBlur: isSelected ? 10 : (showHover && isHovered ? 5 : 0),
    shadowColor: isSelected ? '#4299e1' : (showHover && isHovered ? '#FFFFFF' : undefined),
    opacity: showHover && isHovered ? 0.8 : 1,
  };

  switch (element.type) {
    case 'freehand':
      return (
        <Line
          {...commonProps}
          points={element.points || [0, 0]}
          lineCap="round"
          lineJoin="round"
          tension={0.5}
        />
      );

    case 'line':
      return (
        <Line
          {...commonProps}
          points={element.points || [0, 0, 100, 100]}
          lineCap="round"
          lineJoin="round"
        />
      );

    case 'arrow':
      return (
        <Arrow
          {...commonProps}
          points={element.points || [0, 0, 100, 100]}
          pointerLength={10}
          pointerWidth={10}
          lineCap="round"
          lineJoin="round"
        />
      );

    case 'circle':
      return (
        <KonvaCircle
          {...commonProps}
          radius={element.radius || 30}
          fill="transparent"
        />
      );

    case 'rectangle':
      return (
        <Rect
          {...commonProps}
          width={element.width || 100}
          height={element.height || 60}
          fill="transparent"
        />
      );

    case 'text':
      return (
        <KonvaText
          {...commonProps}
          text={element.text || 'Text'}
          fontSize={element.fontSize || 16}
          fill={element.color || '#FFFFFF'}
          stroke={undefined}
        />
      );

    default:
      return null;
  }
}
