import { useState } from 'react';
import type Konva from 'konva';
import { useEditorStore } from '@/lib/store/editorStore';
import type { DrawingElement, AgentPlacement, AbilityPlacement } from '@/types/strategy';
import {
  getAbilityDefinition,
  getAbilityDimension,
  getMinDimension,
} from '@/lib/constants/abilityDefinitions';

type CanvasElement = DrawingElement | AgentPlacement | AbilityPlacement;

export function useCanvasDrawing(
  scale: number,
  autoScale: number,
  stageRef: React.RefObject<Konva.Stage>,
  isPanning: boolean
) {
  const {
    tool,
    canvasData,
    selectedAgentId,
    selectedAbilityIcon,
    selectedAbilityName,
    selectedAbilitySubType,
    selectedAbilityColor,
    selectedAbilityIsGlobal,
    currentColor,
    strategySide,
    setTool,
    setSelectedAbilityIcon,
    addElement,
    selectElement,
    clearSelection,
    toggleElementSelection,
  } = useEditorStore();

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState<CanvasElement | null>(null);
  const [selectionBox, setSelectionBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  // --- Helpers ---

  const calculatePathDistance = (points: number[]): number => {
    let total = 0;
    for (let i = 0; i < points.length - 2; i += 2) {
      const dx = points[i + 2] - points[i];
      const dy = points[i + 3] - points[i + 1];
      total += Math.sqrt(dx * dx + dy * dy);
    }
    return total;
  };

  const getAdjustedPosition = (pos: { x: number; y: number }, stage: Konva.Stage) => {
    const adjusted = {
      x: (pos.x - stage.x()) / (scale * autoScale),
      y: (pos.y - stage.y()) / (scale * autoScale),
    };
    if (strategySide === 'defense') {
      adjusted.x = 1024 - adjusted.x;
      adjusted.y = 1024 - adjusted.y;
    }
    return adjusted;
  };

  const findElementId = (target: Konva.Node, stage: Konva.Stage) => {
    let curr: Konva.Node | null = target;
    while (curr && curr !== stage) {
      if (curr.id()) return curr.id();
      curr = curr.parent;
    }
    return '';
  };

  // --- Event Handlers ---

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isPanning || e.evt.button !== 0) return;
    const stage = stageRef.current;
    if (!stage) return;

    const isBackground = e.target === stage || e.target.name() === 'map-image';
    const isHandle = e.target.name() === 'edit-handle';
    const elementId = !isBackground && !isHandle ? findElementId(e.target, stage) : '';

    if (tool !== 'select') stage.stopDrag();

    // Selection Box Start
    if (e.evt.shiftKey && isBackground) {
      const pos = stage.getPointerPosition();
      if (pos) {
        const adjusted = getAdjustedPosition(pos, stage);
        setIsSelecting(true);
        setSelectionBox({ x: adjusted.x, y: adjusted.y, width: 0, height: 0 });
      }
      return;
    }

    // Direct Selections
    if (!isBackground && elementId) {
      if (e.evt.ctrlKey) {
        setTool('select');
        selectElement(elementId);
        return;
      }
      if (e.evt.shiftKey) {
        toggleElementSelection(elementId);
        return;
      }
    }

    // Select Tool Logic
    if (tool === 'select') {
      if (elementId && !isHandle) {
        const element = canvasData.elements.find((el) => el.id === elementId);
        if (
          element?.type === 'ability' &&
          (element as AbilityPlacement).subType === 'guided-path'
        ) {
          const abilityEl = element as AbilityPlacement;
          if (!abilityEl.guidedPoints || abilityEl.guidedPoints.length < 4) {
            setIsDrawing(true);
            setCurrentShape({ ...abilityEl, guidedPoints: [0, 0] });
            return;
          }
        }
        selectElement(elementId);
      } else if (isBackground) {
        clearSelection();
      }
      return;
    }

    // Tool-Based Creation
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const adjusted = getAdjustedPosition(pos, stage);

    if (tool === 'agent' && selectedAgentId) {
      const newId = `agent-${Date.now()}`;
      addElement({
        id: newId,
        type: 'agent',
        agentId: selectedAgentId,
        side: strategySide,
        x: adjusted.x,
        y: adjusted.y,
      } as AgentPlacement);
      setTool('select');
      selectElement(newId);
      return;
    }

    if (tool === 'ability' && selectedAbilityIcon) {
      handleAbilityCreation(adjusted);
      return;
    }

    handleDrawingElementCreation(adjusted);
  };

  const handleAbilityCreation = (adjusted: { x: number; y: number }) => {
    const id = `ability-${Date.now()}`;
    if (selectedAbilitySubType === 'guided-path') {
      setIsDrawing(true);
      setCurrentShape({
        id,
        type: 'ability',
        abilityIcon: selectedAbilityIcon!,
        abilityName: selectedAbilityName || undefined,
        subType: selectedAbilitySubType,
        side: strategySide,
        color: selectedAbilityColor || undefined,
        x: adjusted.x,
        y: adjusted.y,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        guidedPoints: [0, 0],
      } as AbilityPlacement);
      return;
    }

    const newAbility: AbilityPlacement = {
      id,
      type: 'ability',
      abilityIcon: selectedAbilityIcon!,
      abilityName: selectedAbilityName || undefined,
      subType: selectedAbilitySubType,
      side: strategySide,
      color: selectedAbilityColor || undefined,
      isGlobal: selectedAbilityIsGlobal,
      x: adjusted.x,
      y: adjusted.y,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };

    const def = getAbilityDefinition(selectedAbilityName || selectedAbilityIcon || '');
    if (['wall', 'path', 'curved-wall'].includes(selectedAbilitySubType)) {
      const isPath = selectedAbilitySubType === 'path';
      const length = def
        ? getMinDimension(def, isPath ? 'height' : 'width') || (isPath ? 400 : 300)
        : isPath
          ? 400
          : 300;
      const thickness = isPath
        ? (def ? getAbilityDimension(def, 'width') : 80) || 80
        : (def ? getAbilityDimension(def, 'height') : 12) || 12;
      newAbility.points = [0, 0, length, 0];
      newAbility.width = thickness;
      if (selectedAbilitySubType === 'curved-wall') {
        newAbility.tension = def?.tension ?? 0.3;
        newAbility.intermediatePoints = 0;
      }
    } else if (['smoke', 'area'].includes(selectedAbilitySubType)) {
      newAbility.radius =
        (def ? getAbilityDimension(def, 'radius') : selectedAbilitySubType === 'smoke' ? 60 : 80) ||
        (selectedAbilitySubType === 'smoke' ? 60 : 80);
    }

    addElement(newAbility);
    setTool('select');
    setSelectedAbilityIcon(null);
    selectElement(id);
  };

  const handleDrawingElementCreation = (adjusted: { x: number; y: number }) => {
    setIsDrawing(true);
    const newShape: DrawingElement = {
      id: `element-${Date.now()}`,
      type:
        tool === 'pen'
          ? 'freehand'
          : tool === 'timer-path'
            ? 'timer-path'
            : (tool as DrawingElement['type']),
      x: adjusted.x,
      y: adjusted.y,
      color: currentColor,
      strokeWidth: 2,
    };

    switch (tool) {
      case 'line':
      case 'arrow':
        newShape.points = [0, 0, 0, 0];
        break;
      case 'pen':
      case 'timer-path':
        newShape.points = [0, 0];
        break;
      case 'circle':
        newShape.radius = 0;
        break;
      case 'rectangle':
        newShape.width = 0;
        newShape.height = 0;
        break;
      case 'text':
        newShape.text = 'Text';
        newShape.fontSize = 16;
        break;
      case 'vision-cone':
        newShape.angle = 90;
        newShape.radius = 150;
        newShape.rotation = 0;
        newShape.opacity = 0.3;
        break;
      case 'icon':
      case 'image':
        newShape.iconType = 'spike';
        newShape.width = 40;
        newShape.height = 40;
        break;
    }
    setCurrentShape(newShape);
  };

  const handleMouseMove = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const adjusted = getAdjustedPosition(pos, stage);

    if (isSelecting && selectionBox) {
      setSelectionBox({
        ...selectionBox,
        width: adjusted.x - selectionBox.x,
        height: adjusted.y - selectionBox.y,
      });
      return;
    }

    if (!isDrawing || !currentShape) return;
    const dx = adjusted.x - currentShape.x;
    const dy = adjusted.y - currentShape.y;

    if (currentShape.type === 'ability') {
      const ability = currentShape as AbilityPlacement;
      const def = getAbilityDefinition(selectedAbilityName || selectedAbilityIcon || '');
      const maxDist = (def ? getAbilityDimension(def, 'maxDistance') : 300) || 300;
      const newPoints = [...(ability.guidedPoints || [0, 0]), dx, dy];
      if (calculatePathDistance(newPoints) <= maxDist) {
        setCurrentShape({ ...ability, guidedPoints: newPoints });
      }
    } else if (currentShape.type !== 'agent') {
      updateDrawingPreview(currentShape as DrawingElement, dx, dy);
    }
  };

  const updateDrawingPreview = (drawingShape: DrawingElement, dx: number, dy: number) => {
    switch (tool) {
      case 'pen':
      case 'timer-path':
        setCurrentShape({ ...drawingShape, points: [...(drawingShape.points || [0, 0]), dx, dy] });
        break;
      case 'line':
      case 'arrow':
        setCurrentShape({ ...drawingShape, points: [0, 0, dx, dy] });
        break;
      case 'circle':
        setCurrentShape({ ...drawingShape, radius: Math.sqrt(dx * dx + dy * dy) });
        break;
      case 'rectangle':
        setCurrentShape({ ...drawingShape, width: dx, height: dy });
        break;
      case 'vision-cone':
        const radius = Math.sqrt(dx * dx + dy * dy);
        setCurrentShape({
          ...drawingShape,
          radius,
          rotation: radius > 5 ? Math.atan2(dy, dx) * (180 / Math.PI) : drawingShape.rotation,
        });
        break;
      case 'icon':
      case 'image':
        setCurrentShape({ ...drawingShape, width: Math.abs(dx), height: Math.abs(dy) });
        break;
    }
  };

  const handleMouseUp = () => {
    if (isPanning) return;
    if (isSelecting && selectionBox) {
      const box = {
        x1: Math.min(selectionBox.x, selectionBox.x + selectionBox.width),
        y1: Math.min(selectionBox.y, selectionBox.y + selectionBox.height),
        x2: Math.max(selectionBox.x, selectionBox.x + selectionBox.width),
        y2: Math.max(selectionBox.y, selectionBox.y + selectionBox.height),
      };
      canvasData.elements.forEach((el) => {
        if (el.x >= box.x1 && el.x <= box.x2 && el.y >= box.y1 && el.y <= box.y2)
          toggleElementSelection(el.id);
      });
      setIsSelecting(false);
      setSelectionBox(null);
      return;
    }

    if (!isDrawing || !currentShape) return;
    addElement(currentShape);
    setIsDrawing(false);
    setCurrentShape(null);

    if (
      currentShape.type === 'ability' &&
      (currentShape as AbilityPlacement).subType === 'guided-path'
    ) {
      setTool('select');
      setSelectedAbilityIcon(null);
      selectElement(currentShape.id);
    }
  };

  return {
    isDrawing,
    currentShape,
    selectionBox,
    isSelecting,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
