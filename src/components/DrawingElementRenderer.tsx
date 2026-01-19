import { memo, useState, useRef } from 'react';
import { Line, Arrow, Circle as KonvaCircle, Rect, Text as KonvaText, Group, Circle, Wedge, Image as KonvaImage, Path } from 'react-konva';
import { useEditorStore } from '@/lib/store/editorStore';
import type { DrawingElement } from '@/types/strategy';
import type Konva from 'konva';
import useImage from 'use-image';

interface DrawingElementRendererProps {
  element: DrawingElement;
  isSelected: boolean;
  isDraggable?: boolean;
  showHover?: boolean;
  onSelect: () => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onTextEdit?: (newText: string) => void;
}

interface IconConfig {
  outline: string;
  isSolid?: boolean;
  detail?: string;
}

const LUCIDE_PATHS: Record<string, IconConfig> = {
  flag: {
    outline: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7",
    isSolid: true
  },
  danger: {
    outline: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
    detail: "M12 9v4 M12 17h.01"
  },
  warning: {
    outline: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
    detail: "M12 8v4 M12 16h.01"
  }
};

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
  const groupRef = useRef<Konva.Group>(null);

  // --- Global Drag Listener Logic ---
  const isDraggingHandle = useRef(false);
  const dragStartPos = useRef<{ x: number, y: number } | null>(null);
  const dragStartElement = useRef<DrawingElement | null>(null);

  const startDrag = (e: Konva.KonvaEventObject<MouseEvent>, type: 'radius' | 'start-point' | 'end-point' | 'rect-size' | 'vision-radius' | 'vision-angle' | 'icon-size' | 'text-size' | 'rotation') => {
    e.cancelBubble = true;
    const stage = e.target.getStage();
    if (!stage) return;

    // Get pointer in SCREEN coordinates (stable)
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    isDraggingHandle.current = true;
    dragStartPos.current = pointer;
    dragStartElement.current = { ...element }; // Correctly capture initial state

    const handleMouseMove = () => {
      if (!isDraggingHandle.current || !dragStartPos.current || !dragStartElement.current || !groupRef.current) return;

      const layer = groupRef.current.getLayer();
      if (!layer) return;

      const stage = layer.getStage();
      if (!stage) return;

      // Current pointer in SCREEN coordinates
      const currentPointer = stage.getPointerPosition();
      if (!currentPointer) return;

      const startState = dragStartElement.current;

      // Calculate Scale Factor (hypotenuse of scale x and y)
      // Usually scaleX === scaleY for zoom.
      // We need to divide screen pixel delta by this scale to get canvas unit delta.
      const transform = layer.getAbsoluteTransform();
      const scaleX = Math.sqrt(transform.m[0] * transform.m[0] + transform.m[1] * transform.m[1]);

      // Group absolute position in screen pixels
      const groupAbsPos = groupRef.current.getAbsolutePosition();

      if (type === 'rotation') {
        const dx = currentPointer.x - groupAbsPos.x;
        const dy = currentPointer.y - groupAbsPos.y;
        const angleRad = Math.atan2(dy, dx);
        let angleDeg = (angleRad * 180) / Math.PI;
        angleDeg += 90; // Adjust for handle at top
        updateElement(element.id, { rotation: Number(angleDeg.toFixed(2)) });
      }
      else if (type === 'vision-radius' || type === 'radius') {
        const dx = currentPointer.x - groupAbsPos.x;
        const dy = currentPointer.y - groupAbsPos.y;
        // Distance in screen pixels
        const distScreen = Math.sqrt(dx * dx + dy * dy);
        // Distance in local canvas units
        const distLocal = distScreen / scaleX;

        if (type === 'radius') {
          updateElement(element.id, { radius: distLocal });
        } else {
          // Vision radius also rotates
          const rotationRad = Math.atan2(dy, dx);
          const rotationDeg = (rotationRad * 180) / Math.PI;
          updateElement(element.id, {
            radius: Math.max(5, distLocal),
            rotation: distLocal > 5 ? Number(rotationDeg.toFixed(2)) : startState.rotation
          });
        }
      }
      else if (type === 'vision-angle') {
        // We need local coordinate of mouse relative to the group to get angle
        // Transform screen pointer to local group space
        const transform = groupRef.current.getAbsoluteTransform().copy().invert();
        const localPos = transform.point(currentPointer);

        const angleRad = Math.atan2(localPos.y, localPos.x);
        const angleDeg = (angleRad * 180) / Math.PI;
        const relativeAngle = Math.abs(angleDeg) * 2;
        updateElement(element.id, { angle: Number(Math.min(360, Math.max(10, relativeAngle)).toFixed(2)) });
      }
      else if (type === 'rect-size' || type === 'icon-size' || type === 'text-size') {
        // Transform screen pointer to local group space
        const transform = groupRef.current.getAbsoluteTransform().copy().invert();
        const localPos = transform.point(currentPointer);

        // Ensure we don't flip inverted
        const w = Math.abs(localPos.x) * 2;
        const h = Math.abs(localPos.y) * 2; // Basic symmetric resize

        if (type === 'text-size') {
          const newSize = Math.max(8, h / 1.2);
          updateElement(element.id, { fontSize: Number(newSize.toFixed(0)) });
        } else {
          updateElement(element.id, { width: w, height: h });
        }
      }
      // Note: Start/End point dragging for lines/arrows
      else if (type === 'start-point' || type === 'end-point') {
        const transform = groupRef.current.getAbsoluteTransform().copy().invert();
        const localPos = transform.point(currentPointer);

        // Snap to grid or just use raw local pos? Raw for smooth drag.
        // Points array: [x1, y1, x2, y2]
        const points = [...(element.points || [0, 0, 100, 100])];
        if (type === 'start-point') {
          points[0] = localPos.x;
          points[1] = localPos.y;
        } else {
          points[2] = localPos.x;
          points[3] = localPos.y;
        }
        updateElement(element.id, { points });
      }
    };

    const handleMouseUp = () => {
      isDraggingHandle.current = false;
      dragStartPos.current = null;
      dragStartElement.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const isSelectTool = tool === 'select';

  const [customImg] = useImage(element.type === 'image' ? element.imageUrl || '' : '');
  const [spikeImg] = useImage(element.type === 'icon' && element.iconType === 'spike' ? '/assets/icons/spike.png' : '');

  const getPathDistance = (points: number[]): number => {
    let total = 0;
    for (let i = 0; i < points.length - 2; i += 2) {
      const dx = points[i + 2] - points[i];
      const dy = points[i + 3] - points[i + 1];
      total += Math.sqrt(dx * dx + dy * dy);
    }
    return total;
  };

  const commonProps = {
    id: element.id,
    x: 0,
    y: 0,
    draggable: false, // Handles shouldn't drag, nor inner shapes
    stroke: element.color || '#FF4655',
    strokeWidth: element.strokeWidth || 2,
    opacity: (element.opacity !== undefined ? element.opacity : 1) * (showHover && isHovered ? 0.8 : 1),
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
            {/* Markers every 3 seconds of running? Or just labels every few points? */}
          </Group>
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

      case 'vision-cone':
        return (
          <Wedge
            {...commonProps}
            radius={element.radius || 150}
            angle={element.angle || 90}
            fill={element.color || '#FF4655'}
            opacity={(element.opacity ?? 1) * 0.3}
            rotation={-(element.angle || 90) / 2}
            perfectDrawEnabled={false}
            shadowForStrokeEnabled={false}
          />
        );

      case 'icon':
      case 'image':
        if (element.type === 'icon' && element.iconType) {
          if (element.iconType === 'spike') {
            const w = element.width || 40;
            const h = element.height || 40;
            return (
              <KonvaImage
                {...commonProps}
                image={spikeImg}
                width={w}
                height={h}
                offsetX={w / 2}
                offsetY={h / 2}
              />
            );
          }
          const iconConfig = LUCIDE_PATHS[element.iconType as keyof typeof LUCIDE_PATHS];
          if (iconConfig) {
            const scale = (element.width || 40) / 24;
            return (
              <Group
                {...commonProps}
                stroke={undefined}
                strokeWidth={0}
              >
                <Path
                  data={iconConfig.outline}
                  fill={iconConfig.isSolid ? (element.color || '#FF4655') : 'transparent'}
                  stroke={iconConfig.isSolid ? (element.color || '#FF4655') : (element.color || '#FF4655')}
                  strokeWidth={2}
                  scaleX={scale}
                  scaleY={scale}
                  offset={{ x: 12, y: 12 }}
                />
                {iconConfig.detail && (
                  <Path
                    data={iconConfig.detail}
                    stroke={iconConfig.isSolid ? '#000000' : (element.color || '#FF4655')}
                    strokeWidth={2}
                    scaleX={scale}
                    scaleY={scale}
                    offset={{ x: 12, y: 12 }}
                  />
                )}
              </Group>
            );
          }
        }

        const currentImg = customImg;
        const w = element.width || 40;
        const h = element.height || 40;
        return (
          <KonvaImage
            {...commonProps}
            width={w}
            height={h}
            offsetX={w / 2}
            offsetY={h / 2}
            image={currentImg}
          />
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
        const textWidth = (element.text || 'Text').length * (element.fontSize || 16) * 0.6;
        const textHeight = (element.fontSize || 16) * 1.2;
        return (
          <>
            {/* Background rectangle for better readability */}
            <Rect
              x={-textWidth / 2} // Centered
              y={-textHeight / 2} // Centered
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
              strokeWidth={0}
              padding={4}
              align="center"
              verticalAlign="middle"
              offsetX={textWidth / 2} // Centered
              offsetY={textHeight / 2} // Centered
              perfectDrawEnabled={true}
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
      ref={groupRef}
      x={element.x}
      y={element.y}
      rotation={element.rotation || 0}
      scaleX={element.scaleX || 1}
      scaleY={element.scaleY || 1}
      draggable={isSelectTool}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      onMouseEnter={(e: Konva.KonvaEventObject<MouseEvent>) => {
        setIsHovered(true);
        if (isDraggable && isSelectTool) {
          const container = e.target.getStage()?.container();
          if (container) container.style.cursor = 'move';
        }
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
          {/* Handles for Line/Arrow Start/End */}
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
                draggable={false} // Custom Drag
                onMouseDown={(e) => startDrag(e, 'start-point')}
                onMouseEnter={(e) => {
                  const stage = e.target.getStage();
                  if (stage) stage.container().style.cursor = 'move';
                }}
                onMouseLeave={(e) => {
                  const stage = e.target.getStage();
                  if (stage) stage.container().style.cursor = 'default';
                }}
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
                draggable={false} // Custom Drag
                onMouseDown={(e) => startDrag(e, 'end-point')}
                onMouseEnter={(e) => {
                  const stage = e.target.getStage();
                  if (stage) stage.container().style.cursor = 'move';
                }}
                onMouseLeave={(e) => {
                  const stage = e.target.getStage();
                  if (stage) stage.container().style.cursor = 'default';
                }}
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
              draggable={false} // Custom Drag
              onMouseDown={(e) => startDrag(e, 'radius')}
              onMouseEnter={(e) => {
                const stage = e.target.getStage();
                if (stage) stage.container().style.cursor = 'ew-resize';
              }}
              onMouseLeave={(e) => {
                const stage = e.target.getStage();
                if (stage) stage.container().style.cursor = 'default';
              }}
              perfectDrawEnabled={false}
            />
          )}
          {element.type === 'vision-cone' && (
            <Group key={`${element.id} -vision - handles`}>
              {/* Radius/Length Handle */}
              <Circle
                key={`${element.id} -vision - radius`}
                name="edit-handle"
                x={element.radius || 150}
                y={0}
                radius={8}
                fill="white"
                stroke="#3b82f6"
                strokeWidth={2}
                draggable={false} // Custom Drag
                onMouseDown={(e) => startDrag(e, 'vision-radius')}
                onMouseEnter={(e) => {
                  const stage = e.target.getStage();
                  if (stage) stage.container().style.cursor = 'move';
                }}
                onMouseLeave={(e) => {
                  const stage = e.target.getStage();
                  if (stage) stage.container().style.cursor = 'default';
                }}
                perfectDrawEnabled={false}
              />
              {/* Angle Handle */}
              <Circle
                key={`${element.id} -vision - angle`}
                name="edit-handle"
                x={(element.radius || 150) * Math.cos(((element.angle || 90) / 2) * Math.PI / 180)}
                y={(element.radius || 150) * Math.sin(((element.angle || 90) / 2) * Math.PI / 180)}
                radius={6}
                fill="white"
                stroke="#A855F7"
                strokeWidth={2}
                draggable={false} // Custom Drag
                onMouseDown={(e) => startDrag(e, 'vision-angle')}
                onMouseEnter={(e) => {
                  const stage = e.target.getStage();
                  if (stage) stage.container().style.cursor = 'crosshair';
                }}
                onMouseLeave={(e) => {
                  const stage = e.target.getStage();
                  if (stage) stage.container().style.cursor = 'default';
                }}
                perfectDrawEnabled={false}
              />
            </Group>
          )}
          {/* Generic handles for Rect/Icon/Image/Text */}
          {(element.type === 'rectangle' || element.type === 'icon' || element.type === 'image' || element.type === 'text') && (
            <Circle
              key={`${element.id} -generic - size`}
              name="edit-handle"
              x={element.type === 'text'
                ? ((element.text || 'Text').length * (element.fontSize || 16) * 0.6) / 2 + 4
                : (element.type === 'rectangle' ? (element.width || 100) / 2 : (element.width || 40) / 2)}
              y={element.type === 'text'
                ? ((element.fontSize || 16) * 1.2) / 2 + 4
                : (element.type === 'rectangle' ? (element.height || 60) / 2 : (element.height || 40) / 2)}
              radius={8}
              fill="white"
              stroke="#3b82f6"
              strokeWidth={2}
              draggable={false} // Custom Drag
              onMouseDown={(e) => startDrag(e, element.type === 'rectangle' ? 'rect-size' : (element.type === 'text' ? 'text-size' : 'icon-size'))}
              onMouseEnter={(e) => {
                const stage = e.target.getStage();
                if (stage) stage.container().style.cursor = 'nwse-resize';
              }}
              onMouseLeave={(e) => {
                const stage = e.target.getStage();
                if (stage) stage.container().style.cursor = 'default';
              }}
              perfectDrawEnabled={false}
            />
          )}
          {/* Rotation Handle */}
          {element.type !== 'vision-cone' && element.type !== 'freehand' && element.type !== 'line' && element.type !== 'arrow' && (element.type as string) !== 'circle' && (
            <Circle
              key={`${element.id}-rotation-handle`}
              name="edit-handle"
              x={0}
              y={element.type === 'text'
                ? -((element.fontSize || 16) * 1.2 / 2 + 25)
                : (element.height ? -(element.height / 2 + 25) : -40)}
              radius={6}
              fill="#A855F7"
              stroke="white"
              strokeWidth={1}
              draggable={false} // Custom drag
              onMouseDown={(e) => startDrag(e, 'rotation')}
              onMouseEnter={() => (document.body.style.cursor = 'crosshair')}
              onMouseLeave={() => (document.body.style.cursor = 'default')}
              perfectDrawEnabled={false}
            />
          )}
        </>
      )}
    </Group>
  );
});
