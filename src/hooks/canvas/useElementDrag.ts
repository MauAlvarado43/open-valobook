import { useRef } from 'react';
import type Konva from 'konva';
import type { DrawingElement } from '@/types/strategy';
import { useEditorStore } from '@/lib/store/editorStore';

export function useElementDrag(element: DrawingElement, groupRef: React.RefObject<Konva.Group>) {
  const { updateElement } = useEditorStore();
  const isDraggingHandle = useRef(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const dragStartElement = useRef<DrawingElement | null>(null);

  const startDrag = (e: Konva.KonvaEventObject<MouseEvent>, type: string) => {
    if (e.evt.button !== 0) return;
    e.cancelBubble = true;
    const stage = e.target.getStage();
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    isDraggingHandle.current = true;
    dragStartPos.current = pointer;
    dragStartElement.current = { ...element };

    const handleMouseMove = () => {
      if (
        !isDraggingHandle.current ||
        !dragStartPos.current ||
        !dragStartElement.current ||
        !groupRef.current
      )
        return;

      const layer = groupRef.current.getLayer();
      if (!layer) return;

      const stage = layer.getStage();
      if (!stage) return;

      const currentPointer = stage.getPointerPosition();
      if (!currentPointer) return;

      const startState = dragStartElement.current;
      const transform = layer.getAbsoluteTransform();
      const scaleX = Math.sqrt(transform.m[0] * transform.m[0] + transform.m[1] * transform.m[1]);
      const groupAbsPos = groupRef.current.getAbsolutePosition();

      if (type === 'rotation') {
        const dx = currentPointer.x - groupAbsPos.x;
        const dy = currentPointer.y - groupAbsPos.y;
        const angleRad = Math.atan2(dy, dx);
        let angleDeg = (angleRad * 180) / Math.PI;
        angleDeg += 90;
        updateElement(element.id, { rotation: Number(angleDeg.toFixed(2)) });
      } else if (type === 'vision-radius' || type === 'radius') {
        const dx = currentPointer.x - groupAbsPos.x;
        const dy = currentPointer.y - groupAbsPos.y;
        const distScreen = Math.sqrt(dx * dx + dy * dy);
        const distLocal = distScreen / scaleX;

        if (type === 'radius') {
          updateElement(element.id, { radius: distLocal });
        } else {
          const rotationRad = Math.atan2(dy, dx);
          const rotationDeg = (rotationRad * 180) / Math.PI;
          updateElement(element.id, {
            radius: Math.max(5, distLocal),
            rotation: distLocal > 5 ? Number(rotationDeg.toFixed(2)) : startState.rotation,
          });
        }
      } else if (type === 'vision-angle') {
        const transform = groupRef.current.getAbsoluteTransform().copy().invert();
        const localPos = transform.point(currentPointer);
        const angleRad = Math.atan2(localPos.y, localPos.x);
        const angleDeg = (angleRad * 180) / Math.PI;
        const relativeAngle = Math.abs(angleDeg) * 2;
        updateElement(element.id, {
          angle: Number(Math.min(360, Math.max(10, relativeAngle)).toFixed(2)),
        });
      } else if (type === 'rect-size' || type === 'icon-size' || type === 'text-size') {
        const transform = groupRef.current.getAbsoluteTransform().copy().invert();
        const localPos = transform.point(currentPointer);
        const w = Math.abs(localPos.x) * 2;
        const h = Math.abs(localPos.y) * 2;

        if (type === 'text-size') {
          const newSize = Math.max(8, h / 1.2);
          updateElement(element.id, { fontSize: Number(newSize.toFixed(0)) });
        } else {
          updateElement(element.id, { width: w, height: h });
        }
      } else if (type === 'start-point' || type === 'end-point') {
        const transform = groupRef.current.getAbsoluteTransform().copy().invert();
        const localPos = transform.point(currentPointer);
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

  return { startDrag };
}
