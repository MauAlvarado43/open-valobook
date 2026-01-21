import { memo, useState, useRef } from 'react';
import { Line, Arrow, Circle as KonvaCircle, Rect, Group } from 'react-konva';
import { useEditorStore } from '@/lib/store/editorStore';
import type { DrawingElement } from '@/types/strategy';
import type Konva from 'konva';

// Sub-renderers
import { TimerPathRenderer } from '@/components/canvas/elements/TimerPathRenderer';
import { VisionConeRenderer } from '@/components/canvas/elements/VisionConeRenderer';
import { IconRenderer } from '@/components/canvas/elements/IconRenderer';
import { ImageRenderer } from '@/components/canvas/elements/ImageRenderer';
import { TextRenderer } from '@/components/canvas/elements/TextRenderer';
import { TransformHandle } from '@/components/canvas/TransformHandle';
import { useElementDrag } from '@/hooks/canvas/useElementDrag';

interface DrawingElementRendererProps {
  element: DrawingElement;
  isSelected: boolean;
  isDraggable?: boolean;
  showHover?: boolean;
  onSelect: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onTextEdit?: (newText: string) => void;
  rotationOffset?: number;
}

export const DrawingElementRenderer = memo(function DrawingElementRenderer({
  element,
  isSelected,
  isDraggable = true,
  showHover = true,
  onSelect,
  onDragEnd,
  rotationOffset = 0,
}: DrawingElementRendererProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { tool } = useEditorStore();
  const groupRef = useRef<Konva.Group>(null);
  const { startDrag } = useElementDrag(element, groupRef);

  const isSelectTool = tool === 'select';
  const commonProps = {
    id: element.id,
    x: 0,
    y: 0,
    draggable: false,
    stroke: element.color || '#FF4655',
    strokeWidth: element.strokeWidth || 2,
    opacity:
      (element.opacity !== undefined ? element.opacity : 1) * (showHover && isHovered ? 0.8 : 1),
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

      case 'timer-path':
        return <TimerPathRenderer element={element} commonProps={commonProps} />;

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
        return <KonvaCircle {...commonProps} radius={element.radius || 30} fill="transparent" />;

      case 'vision-cone':
        return (
          <VisionConeRenderer
            element={element}
            commonProps={commonProps}
            showHover={showHover}
            isHovered={isHovered}
          />
        );

      case 'icon':
        return (
          <Group rotation={-rotationOffset}>
            <IconRenderer element={element} commonProps={commonProps} />
          </Group>
        );

      case 'image':
        return (
          <Group rotation={-rotationOffset}>
            <ImageRenderer element={element} commonProps={commonProps} />
          </Group>
        );

      case 'rectangle':
        return (
          <Rect
            {...commonProps}
            width={element.width || 100}
            height={element.height || 60}
            offsetX={(element.width || 100) / 2}
            offsetY={(element.height || 60) / 2}
            fill="transparent"
          />
        );

      case 'text':
        return (
          <Group rotation={-rotationOffset}>
            <TextRenderer element={element} commonProps={commonProps} />
          </Group>
        );

      default:
        return null;
    }
  };

  return (
    <Group
      id={element.id}
      ref={groupRef}
      x={element.x}
      y={element.y}
      rotation={element.rotation || 0}
      scaleX={element.scaleX || 1}
      scaleY={element.scaleY || 1}
      draggable={isDraggable}
      dragButtons={[0]}
      onMouseDown={(e) => {
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
        if (e.evt.shiftKey || e.evt.button === 2) {
          e.target.stopDrag();
        }
        if (e.evt.button === 1) {
          e.target.stopDrag();
        }
      }}
      onContextMenu={(e) => {
        e.evt.preventDefault();
        onSelect(e);
      }}
      onMouseEnter={(e: Konva.KonvaEventObject<MouseEvent>) => {
        setIsHovered(true);
        // Only change cursor if no mouse button is pressed (to avoid overriding panning cursor)
        if (isDraggable && isSelectTool && e.evt.buttons === 0) {
          const container = e.target.getStage()?.container();
          if (container) container.style.cursor = 'move';
        }
      }}
      onMouseLeave={(e: Konva.KonvaEventObject<MouseEvent>) => {
        setIsHovered(false);
        // Only reset cursor if no buttons are pressed
        if (e.evt.buttons === 0) {
          const container = e.target.getStage()?.container();
          if (container) container.style.cursor = 'default';
        }
      }}
    >
      {renderShape()}

      {/* Resize Handles */}
      {isSelected && isSelectTool && (
        <Group>
          {/* Handles for Line/Arrow Start/End */}
          {(element.type === 'line' || element.type === 'arrow') && element.points && (
            <>
              <TransformHandle
                x={element.points[0]}
                y={element.points[1]}
                cursor="move"
                onMouseDown={(e) => startDrag(e, 'start-point')}
              />
              <TransformHandle
                x={element.points[2]}
                y={element.points[3]}
                cursor="move"
                onMouseDown={(e) => startDrag(e, 'end-point')}
              />
            </>
          )}

          {element.type === 'circle' && (
            <TransformHandle
              x={element.radius || 30}
              y={0}
              cursor="ew-resize"
              onMouseDown={(e) => startDrag(e, 'radius')}
            />
          )}

          {element.type === 'vision-cone' && (
            <>
              <TransformHandle
                x={element.radius || 150}
                y={0}
                cursor="ew-resize"
                onMouseDown={(e) => startDrag(e, 'vision-radius')}
              />
              <TransformHandle
                x={
                  (element.radius || 150) * Math.cos((((element.angle || 90) / 2) * Math.PI) / 180)
                }
                y={
                  (element.radius || 150) * Math.sin((((element.angle || 90) / 2) * Math.PI) / 180)
                }
                radius={6}
                stroke="#A855F7"
                cursor="crosshair"
                onMouseDown={(e) => startDrag(e, 'vision-angle')}
              />
            </>
          )}

          {/* Generic handles for Rect/Icon/Image/Text */}
          {(element.type === 'rectangle' ||
            element.type === 'icon' ||
            element.type === 'image' ||
            element.type === 'text') && (
            <TransformHandle
              x={
                element.type === 'text'
                  ? ((element.text || 'Text').length * (element.fontSize || 16) * 0.6) / 2 + 4
                  : element.type === 'rectangle'
                    ? (element.width || 100) / 2
                    : (element.width || 40) / 2
              }
              y={
                element.type === 'text'
                  ? ((element.fontSize || 16) * 1.2) / 2 + 4
                  : element.type === 'rectangle'
                    ? (element.height || 60) / 2
                    : (element.height || 40) / 2
              }
              cursor="nwse-resize"
              onMouseDown={(e) =>
                startDrag(
                  e,
                  element.type === 'rectangle'
                    ? 'rect-size'
                    : element.type === 'text'
                      ? 'text-size'
                      : 'icon-size'
                )
              }
            />
          )}

          {/* Rotation Handle */}
          {element.type !== 'vision-cone' &&
            element.type !== 'freehand' &&
            element.type !== 'line' &&
            element.type !== 'arrow' &&
            element.type !== 'circle' &&
            element.type !== 'timer-path' && (
              <TransformHandle
                x={0}
                y={
                  element.type === 'text'
                    ? -(((element.fontSize || 16) * 1.2) / 2 + 25)
                    : element.height
                      ? -(element.height / 2 + 25)
                      : -40
                }
                radius={6}
                fill="#A855F7"
                stroke="white"
                cursor="grab"
                onMouseDown={(e) => startDrag(e, 'rotation')}
              />
            )}
        </Group>
      )}
    </Group>
  );
});
