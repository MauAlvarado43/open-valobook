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

  // Helper function to calculate path distance
  const calculatePathDistance = (points: number[]): number => {
    let total = 0;
    for (let i = 0; i < points.length - 2; i += 2) {
      const dx = points[i + 2] - points[i];
      const dy = points[i + 3] - points[i + 1];
      total += Math.sqrt(dx * dx + dy * dy);
    }
    return total;
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isPanning || e.evt.button !== 0) return;

    const stage = stageRef.current;
    if (!stage) return;

    const isBackground = e.target === stage || e.target.name() === 'map-image';
    const isHandle = e.target.name() === 'edit-handle';

    let elementId = '';
    if (!isBackground && !isHandle) {
      let curr: Konva.Node | null = e.target;
      while (curr && curr !== stage) {
        if (curr.id()) {
          elementId = curr.id();
          break;
        }
        curr = curr.parent;
      }
    }

    if (tool !== 'select') {
      stage.stopDrag();
    }

    // Selection Box start
    if (e.evt.shiftKey && isBackground) {
      stage.stopDrag();
      const pos = stage.getPointerPosition();
      if (pos) {
        const adjustedPos = {
          x: (pos.x - stage.x()) / (scale * autoScale),
          y: (pos.y - stage.y()) / (scale * autoScale),
        };

        if (strategySide === 'defense') {
          adjustedPos.x = 1024 - adjustedPos.x;
          adjustedPos.y = 1024 - adjustedPos.y;
        }
        setIsSelecting(true);
        setSelectionBox({ x: adjustedPos.x, y: adjustedPos.y, width: 0, height: 0 });
      }
      return;
    }

    if (e.evt.ctrlKey && !isBackground && elementId) {
      stage.stopDrag();
      setTool('select');
      selectElement(elementId);
      return;
    }

    if (e.evt.shiftKey && !isBackground && elementId) {
      stage.stopDrag();
      toggleElementSelection(elementId);
      return;
    }

    if (tool === 'select' && elementId && !isHandle) {
      const element = canvasData.elements.find((el) => el.id === elementId);
      if (element && element.type === 'ability') {
        const abilityEl = element as AbilityPlacement;
        if (
          abilityEl.subType === 'guided-path' &&
          (!abilityEl.guidedPoints || abilityEl.guidedPoints.length < 4)
        ) {
          setIsDrawing(true);
          setCurrentShape({ ...abilityEl, guidedPoints: [0, 0] });
          return;
        }
      }
      selectElement(elementId);
    } else if (isBackground) {
      clearSelection();
    }

    if (tool === 'select') return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    const adjustedPos = {
      x: (pos.x - stage.x()) / (scale * autoScale),
      y: (pos.y - stage.y()) / (scale * autoScale),
    };

    if (strategySide === 'defense') {
      adjustedPos.x = 1024 - adjustedPos.x;
      adjustedPos.y = 1024 - adjustedPos.y;
    }

    if (tool === 'agent' && selectedAgentId) {
      const newId = `agent-${Date.now()}`;
      addElement({
        id: newId,
        type: 'agent',
        agentId: selectedAgentId,
        side: strategySide,
        x: adjustedPos.x,
        y: adjustedPos.y,
      } as AgentPlacement);
      setTool('select');
      selectElement(newId);
      return;
    }

    if (tool === 'ability' && selectedAbilityIcon) {
      if (selectedAbilitySubType === 'guided-path') {
        setIsDrawing(true);
        setCurrentShape({
          id: `ability-${Date.now()}`,
          type: 'ability',
          abilityIcon: selectedAbilityIcon,
          abilityName: selectedAbilityName || undefined,
          subType: selectedAbilitySubType,
          side: strategySide,
          color: selectedAbilityColor || undefined,
          x: adjustedPos.x,
          y: adjustedPos.y,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          guidedPoints: [0, 0],
        } as AbilityPlacement);
        return;
      }

      const newId = `ability-${Date.now()}`;
      const newAbility: AbilityPlacement = {
        id: newId,
        type: 'ability',
        abilityIcon: selectedAbilityIcon,
        abilityName: selectedAbilityName || undefined,
        subType: selectedAbilitySubType,
        side: strategySide,
        color: selectedAbilityColor || undefined,
        isGlobal: selectedAbilityIsGlobal,
        x: adjustedPos.x,
        y: adjustedPos.y,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      };

      if (
        selectedAbilitySubType === 'wall' ||
        selectedAbilitySubType === 'path' ||
        selectedAbilitySubType === 'curved-wall'
      ) {
        const def = getAbilityDefinition(selectedAbilityName || selectedAbilityIcon || '');
        const isPath = selectedAbilitySubType === 'path';
        const isCurvedWall = selectedAbilitySubType === 'curved-wall';
        const length = def
          ? getMinDimension(def, isPath ? 'height' : 'width') || (isPath ? 400 : 300)
          : isPath
            ? 400
            : 300;
        const thickness = isPath
          ? (def ? getAbilityDimension(def, 'width') : 80) || 80
          : (def ? getAbilityDimension(def, 'height') : 12) || 12;

        if (isCurvedWall) {
          newAbility.points = [0, 0, length, 0];
          newAbility.tension = def?.tension !== undefined ? def.tension : 0.3;
          newAbility.intermediatePoints = 0;
        } else {
          newAbility.points = [0, 0, length, 0];
        }
        newAbility.width = thickness;
      } else if (selectedAbilitySubType === 'smoke' || selectedAbilitySubType === 'area') {
        const def = getAbilityDefinition(selectedAbilityName || selectedAbilityIcon || '');
        newAbility.radius =
          (def
            ? getAbilityDimension(def, 'radius')
            : selectedAbilitySubType === 'smoke'
              ? 60
              : 80) || (selectedAbilitySubType === 'smoke' ? 60 : 80);
      }

      addElement(newAbility);
      setTool('select');
      setSelectedAbilityIcon(null);
      selectElement(newId);
      return;
    }

    setIsDrawing(true);
    const newShape: DrawingElement = {
      id: `element-${Date.now()}`,
      type:
        tool === 'pen'
          ? 'freehand'
          : tool === 'timer-path'
            ? 'timer-path'
            : (tool as DrawingElement['type']),
      x: adjustedPos.x,
      y: adjustedPos.y,
      color: currentColor,
      strokeWidth: 2,
    };

    if (tool === 'line' || tool === 'arrow') {
      newShape.points = [0, 0, 0, 0];
    } else if (tool === 'pen' || tool === 'timer-path') {
      newShape.points = [0, 0];
    } else if (tool === 'circle') {
      newShape.radius = 0;
    } else if (tool === 'rectangle') {
      newShape.width = 0;
      newShape.height = 0;
    } else if (tool === 'text') {
      newShape.text = 'Text';
      newShape.fontSize = 16;
    } else if (tool === 'vision-cone') {
      newShape.angle = 90;
      newShape.radius = 150;
      newShape.rotation = 0;
      newShape.opacity = 0.3;
    } else if (tool === 'icon' || tool === 'image') {
      newShape.iconType = 'spike';
      newShape.width = 40;
      newShape.height = 40;
    }

    setCurrentShape(newShape);
  };

  const handleMouseMove = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;

    const adjustedPos = {
      x: (pos.x - stage.x()) / (scale * autoScale),
      y: (pos.y - stage.y()) / (scale * autoScale),
    };

    if (strategySide === 'defense') {
      adjustedPos.x = 1024 - adjustedPos.x;
      adjustedPos.y = 1024 - adjustedPos.y;
    }

    if (isSelecting && selectionBox) {
      setSelectionBox({
        ...selectionBox,
        width: adjustedPos.x - selectionBox.x,
        height: adjustedPos.y - selectionBox.y,
      });
      return;
    }

    if (!isDrawing || !currentShape) return;
    const dx = adjustedPos.x - currentShape.x;
    const dy = adjustedPos.y - currentShape.y;

    if (currentShape.type === 'ability') {
      const abilityShape = currentShape as AbilityPlacement;
      const def = getAbilityDefinition(selectedAbilityName || selectedAbilityIcon || '');
      const maxDist = (def ? getAbilityDimension(def, 'maxDistance') : 300) || 300;
      const newPoints = [...(abilityShape.guidedPoints || [0, 0]), dx, dy];

      if (calculatePathDistance(newPoints) <= maxDist) {
        setCurrentShape({ ...abilityShape, guidedPoints: newPoints });
      }
    } else if (currentShape.type !== 'agent') {
      const drawingShape = currentShape as DrawingElement;
      if (tool === 'pen' || tool === 'timer-path') {
        setCurrentShape({ ...drawingShape, points: [...(drawingShape.points || [0, 0]), dx, dy] });
      } else if (tool === 'line' || tool === 'arrow') {
        setCurrentShape({ ...drawingShape, points: [0, 0, dx, dy] });
      } else if (tool === 'circle') {
        setCurrentShape({ ...drawingShape, radius: Math.sqrt(dx * dx + dy * dy) });
      } else if (tool === 'rectangle') {
        setCurrentShape({ ...drawingShape, width: dx, height: dy });
      } else if (tool === 'vision-cone') {
        const radius = Math.sqrt(dx * dx + dy * dy);
        if (radius > 5) {
          setCurrentShape({
            ...drawingShape,
            radius,
            rotation: Math.atan2(dy, dx) * (180 / Math.PI),
          });
        } else {
          setCurrentShape({ ...drawingShape, radius });
        }
      } else if (tool === 'icon' || tool === 'image') {
        setCurrentShape({ ...drawingShape, width: Math.abs(dx), height: Math.abs(dy) });
      }
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
        if (el.x >= box.x1 && el.x <= box.x2 && el.y >= box.y1 && el.y <= box.y2) {
          toggleElementSelection(el.id);
        }
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
