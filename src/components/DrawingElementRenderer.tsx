import { memo, useState } from 'react';
import { Line, Arrow, Circle as KonvaCircle, Rect, Text as KonvaText, Group, Circle } from 'react-konva';
import { useEditorStore } from '@/lib/store/editorStore';
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

export const DrawingElementRenderer = memo(function DrawingElementRenderer({
  element,
  isSelected,
  isDraggable = true,
  showHover = true,
  onSelect,
  onDragEnd,
}: DrawingElementRendererProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { updateElement, tool } = useEditorStore();

  const isSelectTool = tool === 'select';

  const handleResize = (e: Konva.KonvaEventObject<DragEvent>, type: 'radius' | 'start-point' | 'end-point' | 'rect-size') => {
    e.cancelBubble = true;
    const stage = e.target.getStage();
    if (!stage) return;

    const handlePos = { x: e.target.x(), y: e.target.y() };

    if (type === 'radius') {
      const radius = Math.sqrt(handlePos.x * handlePos.x + handlePos.y * handlePos.y);
      updateElement(element.id, { radius });
    } else if (type === 'start-point') {
      const points = [handlePos.x, handlePos.y, element.points![2], element.points![3]];
      updateElement(element.id, { points });
    } else if (type === 'end-point') {
      const points = [element.points![0], element.points![1], handlePos.x, handlePos.y];
      updateElement(element.id, { points });
    } else if (type === 'rect-size') {
      updateElement(element.id, { width: handlePos.x, height: handlePos.y });
    }
  };

  const commonProps = {
    id: element.id,
    x: 0, // We'll move the Group instead
    y: 0,
    draggable: false, // Draggable will be on the Group
    stroke: element.color || '#FF4655',
    strokeWidth: element.strokeWidth || 2,
    rotation: element.rotation || 0,
    scaleX: element.scaleX || 1,
    scaleY: element.scaleY || 1,
    shadowBlur: isSelected ? 10 : (showHover && isHovered ? 5 : 0),
    shadowColor: isSelected ? '#4299e1' : (showHover && isHovered ? '#FFFFFF' : undefined),
    opacity: showHover && isHovered ? 0.8 : 1,
    perfectDrawEnabled: false,
    shadowForStrokeEnabled: false,
  };

  const renderShape = () => {
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
            lineCap="butt"
            lineJoin="miter"
          />
        );

      case 'arrow':
        return (
          <Arrow
            {...commonProps}
            points={element.points || [0, 0, 100, 100]}
            pointerLength={10}
            pointerWidth={10}
            lineCap="butt"
            lineJoin="miter"
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
        const textWidth = (element.text || 'Text').length * (element.fontSize || 16) * 0.6;
        const textHeight = (element.fontSize || 16) * 1.2;
        return (
          <>
            {/* Background rectangle for better readability */}
            <Rect
              x={0}
              y={0}
              width={textWidth}
              height={textHeight}
              fill="#000000"
              opacity={0.6}
              cornerRadius={4}
              perfectDrawEnabled={false}
            />
            <KonvaText
              {...commonProps}
              text={element.text || 'Text'}
              fontSize={element.fontSize || 16}
              fill={element.color || '#FFFFFF'}
              stroke={undefined}
              padding={4}
              perfectDrawEnabled={true} // Text might need it for clarity
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Group
      id={element.id}
      x={element.x}
      y={element.y}
      draggable={isDraggable && isSelectTool}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      onMouseEnter={(e: Konva.KonvaEventObject<MouseEvent>) => {
        setIsHovered(true);
        const container = e.target.getStage()?.container();
        if (container) container.style.cursor = 'pointer';
      }}
      onMouseLeave={(e: Konva.KonvaEventObject<MouseEvent>) => {
        setIsHovered(false);
        const container = e.target.getStage()?.container();
        if (container) container.style.cursor = 'default';
      }}
    >
      {renderShape()}

      {/* Resize Handles */}
      {isSelected && isSelectTool && (
        <>
          {(element.type === 'line' || element.type === 'arrow') && element.points && (
            <Group key={`${element.id}-handles`}>
              {/* Start Point */}
              <Circle
                key={`${element.id}-start`}
                name="edit-handle"
                x={element.points[0]}
                y={element.points[1]}
                radius={8}
                fill="white"
                stroke="#3b82f6"
                strokeWidth={2}
                draggable
                onDragStart={(e) => { e.cancelBubble = true; }}
                onDragMove={(e) => { e.cancelBubble = true; handleResize(e, 'start-point'); }}
                onDragEnd={(e) => { e.cancelBubble = true; }}
                perfectDrawEnabled={false}
              />
              {/* End Point */}
              <Circle
                key={`${element.id}-end`}
                name="edit-handle"
                x={element.points[2]}
                y={element.points[3]}
                radius={8}
                fill="white"
                stroke="#3b82f6"
                strokeWidth={2}
                draggable
                onDragStart={(e) => { e.cancelBubble = true; }}
                onDragMove={(e) => { e.cancelBubble = true; handleResize(e, 'end-point'); }}
                onDragEnd={(e) => { e.cancelBubble = true; }}
                perfectDrawEnabled={false}
              />
            </Group>
          )}
          {element.type === 'circle' && (
            <Circle
              key={`${element.id}-radius-handle`}
              name="edit-handle"
              x={element.radius || 30}
              y={0}
              radius={8}
              fill="white"
              stroke="#3b82f6"
              strokeWidth={2}
              draggable
              onDragStart={(e) => { e.cancelBubble = true; }}
              onDragMove={(e) => { e.cancelBubble = true; handleResize(e, 'radius'); }}
              onDragEnd={(e) => { e.cancelBubble = true; }}
              perfectDrawEnabled={false}
            />
          )}
          {element.type === 'rectangle' && (
            <Circle
              key={`${element.id}-rect-handle`}
              name="edit-handle"
              x={element.width || 100}
              y={element.height || 60}
              radius={8}
              fill="white"
              stroke="#3b82f6"
              strokeWidth={2}
              draggable
              onDragStart={(e) => { e.cancelBubble = true; }}
              onDragMove={(e) => { e.cancelBubble = true; handleResize(e, 'rect-size'); }}
              onDragEnd={(e) => { e.cancelBubble = true; }}
              perfectDrawEnabled={false}
            />
          )}
        </>
      )}
    </Group>
  );
});
