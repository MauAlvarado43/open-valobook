'use client';

import { Stage, Layer, Image as KonvaImage, Rect } from 'react-konva';
import { memo, useRef, useState, useEffect } from 'react';
import { useEditorStore } from '@/lib/store/editorStore';
import useImage from 'use-image';
import { DrawingElementRenderer } from './DrawingElementRenderer';
import { AgentIcon } from './AgentIcon';
import { AbilityIcon } from './AbilityIcon';
import { ElementPropertiesPanel } from './ElementPropertiesPanel';
import { getAbilityDefinition, getAbilityDimension, getMinDimension } from '@/lib/constants/abilityDefinitions';
import type { DrawingElement, AgentPlacement, AbilityPlacement } from '@/types/strategy';
import type Konva from 'konva';

interface StrategyCanvasProps {
  width?: number;
  height?: number;
}

const MapImage = memo(function MapImage({ src, rotation }: { src: string; rotation: number }) {
  const [image] = useImage(src);

  return (
    <KonvaImage
      image={image}
      width={1024}
      height={1024}
      rotation={rotation}
      offsetX={rotation !== 0 ? 1024 / 2 : 0}
      offsetY={rotation !== 0 ? 1024 / 2 : 0}
      x={rotation !== 0 ? 1024 / 2 : 0}
      y={rotation !== 0 ? 1024 / 2 : 0}
      name="map-image"
      listening={false}
      perfectDrawEnabled={false}
    />
  );
});

export function StrategyCanvas({ }: StrategyCanvasProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 1024, height: 1024 });
  const [autoScale, setAutoScale] = useState(1);
  const [stageOffset, setStageOffset] = useState({ x: 0, y: 0 });
  const {
    selectedMap,
    canvasData,
    tool,
    selectedElementId,
    selectedElementIds,
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
    selectElement,
    toggleElementSelection,
    clearSelection,
    updateElement,
    addElement,
    removeElement,
    undo,
    redo
  } = useEditorStore();

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState<DrawingElement | null>(null);
  const [scale, setScale] = useState(1);
  const [selectionBox, setSelectionBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
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

  // Maps that need rotation to be displayed correctly
  const mapRotations: Record<string, number> = {
    'abyss': 90,
    'ascent': 90,
    'bind': 0,
    'breeze': 0,
    'corrode': 90,
    'fracture': 0,
    'haven': 90,
    'icebox': 270,
    'lotus': 0,
    'pearl': 0,
    'split': 90,
    'sunset': 0,
  };

  const mapImageSrc = selectedMap
    ? `/assets/maps/${selectedMap}.png`
    : null;

  const baseRotation = selectedMap ? (mapRotations[selectedMap] || 0) : 0;
  const mapRotation = baseRotation + (strategySide === 'defense' ? 180 : 0);

  // Responsive scaling
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width: cw, height: ch } = containerRef.current.getBoundingClientRect();
        // We want to fit 1024 within the available space
        const s = Math.min(cw / 1024, ch / 1024);
        setAutoScale(s);
        setContainerSize({ width: cw, height: ch });

        // Center the 1024x1024 workspace
        setStageOffset({
          x: (cw - (1024 * s)) / 2,
          y: (ch - (1024 * s)) / 2
        });
      }
    };

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'z') {
        e.preventDefault();
        redo();
      } else if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (e.key === 'Delete') {
        e.preventDefault();
        if (selectedElementIds.length > 0) {
          selectedElementIds.forEach(id => removeElement(id));
        } else if (selectedElementId) {
          removeElement(selectedElementId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedElementId, selectedElementIds, removeElement]);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return;

    const stage = e.target.getStage();
    if (!stage) return;

    // Background is now either the stage itself OR anything not listening (since map-image is not listening)
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

    if (e.evt.shiftKey && isBackground) {
      stage.stopDrag();
      const pos = stage.getPointerPosition();
      if (pos) {
        const adjustedPos = {
          x: (pos.x - stage.x()) / (scale * autoScale),
          y: (pos.y - stage.y()) / (scale * autoScale),
        };
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
      // Special case: if clicking on a guided-path ability without a path, start drawing
      const element = canvasData.elements.find(el => el.id === elementId);
      if (element && element.type === 'ability') {
        const abilityEl = element as AbilityPlacement;
        if (abilityEl.subType === 'guided-path' && (!abilityEl.guidedPoints || abilityEl.guidedPoints.length < 4)) {
          // Start drawing the guided path
          setIsDrawing(true);
          setCurrentShape({
            ...abilityEl,
            guidedPoints: [0, 0]
          } as any);
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

    if (tool === 'agent' && selectedAgentId) {
      const newId = `agent-${Date.now()}`;
      const newAgent: AgentPlacement = {
        id: newId,
        type: 'agent',
        agentId: selectedAgentId,
        side: strategySide,
        x: adjustedPos.x,
        y: adjustedPos.y,
      };
      addElement(newAgent);
      setTool('select');
      selectElement(newId);
      return;
    }


    if (tool === 'ability' && selectedAbilityIcon) {
      // Handle guided-path abilities (pen-style: click and drag to draw)
      if (selectedAbilitySubType === 'guided-path') {
        setIsDrawing(true);
        const newAbility: any = {
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
          guidedPoints: [0, 0], // Start at origin, will add points as user drags
        };

        setCurrentShape(newAbility);
        return;
      }

      // Regular ability placement (non-guided-path)
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

      if (selectedAbilitySubType === 'wall' || selectedAbilitySubType === 'path' || selectedAbilitySubType === 'curved-wall') {
        const def = getAbilityDefinition(selectedAbilityName || selectedAbilityIcon || '');
        const isPath = selectedAbilitySubType === 'path';
        const isCurvedWall = selectedAbilitySubType === 'curved-wall';

        // Use minimum dimension for initial placement
        const length = def
          ? getMinDimension(def, isPath ? 'height' : 'width') || (isPath ? 400 : 300)
          : (isPath ? 400 : 300);

        const thickness = isPath
          ? (def ? getAbilityDimension(def, 'width') : 80) || 80
          : (def ? getAbilityDimension(def, 'height') : 12) || 12; // Wall height is thickness

        // For curved walls, create intermediate points
        if (isCurvedWall) {
          // Get number of intermediate points from definition (default: 3)
          const numIntermediatePoints = def?.intermediatePoints || 0;
          const totalPoints = numIntermediatePoints + 2; // +2 for start and end
          const step = length / (totalPoints - 1);

          const points: number[] = [];
          for (let i = 0; i < totalPoints; i++) {
            points.push(step * i, 0);
          }
          newAbility.points = points;
          // Store tension value from definition (default: 0.3 for smooth curves)
          newAbility.tension = def?.tension !== undefined ? def.tension : 0.3;
        } else {
          newAbility.points = [0, 0, length, 0];
        }
        newAbility.width = thickness;
      } else if (selectedAbilitySubType === 'smoke') {
        const def = getAbilityDefinition(selectedAbilityName || selectedAbilityIcon || '');
        newAbility.radius = (def ? getAbilityDimension(def, 'radius') : 60) || 60;
      } else if (selectedAbilitySubType === 'area') {
        const def = getAbilityDefinition(selectedAbilityName || selectedAbilityIcon || '');
        newAbility.radius = (def ? getAbilityDimension(def, 'radius') : 80) || 80;
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
      type: tool === 'pen' ? 'freehand' : (tool as DrawingElement['type']),
      x: adjustedPos.x,
      y: adjustedPos.y,
      color: currentColor,
      strokeWidth: 2,
    };

    if (tool === 'line' || tool === 'arrow') {
      newShape.points = [0, 0, 0, 0];
    } else if (tool === 'pen') {
      newShape.points = [0, 0];
    } else if (tool === 'circle') {
      newShape.radius = 0;
    } else if (tool === 'rectangle') {
      newShape.width = 0;
      newShape.height = 0;
    } else if (tool === 'text') {
      newShape.text = 'Text';
      newShape.fontSize = 16;
    }
    setCurrentShape(newShape);
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;

    const adjustedPos = {
      x: (pos.x - stage.x()) / (scale * autoScale),
      y: (pos.y - stage.y()) / (scale * autoScale),
    };

    if (isSelecting && selectionBox) {
      setSelectionBox({
        x: selectionBox.x,
        y: selectionBox.y,
        width: adjustedPos.x - selectionBox.x,
        height: adjustedPos.y - selectionBox.y,
      });
      return;
    }

    if (!isDrawing || !currentShape) return;
    const dx = adjustedPos.x - currentShape.x;
    const dy = adjustedPos.y - currentShape.y;

    // Handle guided-path (like pen but with distance limit)
    if ((currentShape as any).subType === 'guided-path') {
      const abilityShape = currentShape as any;
      const def = getAbilityDefinition(selectedAbilityName || selectedAbilityIcon || '');
      const maxDist = (def ? getAbilityDimension(def, 'maxDistance') : 300) || 300;

      const lastPoints = abilityShape.guidedPoints || [0, 0];
      const newPoints = [...lastPoints, dx, dy];

      // Check distance limit
      const totalDistance = calculatePathDistance(newPoints);
      if (totalDistance <= maxDist) {
        setCurrentShape({ ...abilityShape, guidedPoints: newPoints });
      }
    } else if (tool === 'pen') {
      const lastPoint = currentShape.points || [0, 0];
      setCurrentShape({ ...currentShape, points: [...lastPoint, dx, dy] });
    } else if (tool === 'line' || tool === 'arrow') {
      setCurrentShape({ ...currentShape, points: [0, 0, dx, dy] });
    } else if (tool === 'circle') {
      const radius = Math.sqrt(dx * dx + dy * dy);
      setCurrentShape({ ...currentShape, radius });
    } else if (tool === 'rectangle') {
      setCurrentShape({ ...currentShape, width: dx, height: dy });
    }
  };

  const handleMouseUp = () => {
    if (isSelecting && selectionBox) {
      const box = {
        x1: Math.min(selectionBox.x, selectionBox.x + selectionBox.width),
        y1: Math.min(selectionBox.y, selectionBox.y + selectionBox.height),
        x2: Math.max(selectionBox.x, selectionBox.x + selectionBox.width),
        y2: Math.max(selectionBox.y, selectionBox.y + selectionBox.height),
      };
      canvasData.elements.forEach((element) => {
        if (element.x >= box.x1 && element.x <= box.x2 && element.y >= box.y1 && element.y <= box.y2) {
          toggleElementSelection(element.id);
        }
      });
      setIsSelecting(false);
      setSelectionBox(null);
      return;
    }

    if (!isDrawing || !currentShape) return;

    // Add the element and clean up
    addElement(currentShape);
    setIsDrawing(false);
    setCurrentShape(null);

    // For guided-path, also switch to select mode and deselect ability
    if ((currentShape as any).subType === 'guided-path') {
      setTool('select');
      setSelectedAbilityIcon(null);
      selectElement(currentShape.id);
    }
  };

  const handleElementDragEnd = (id: string) => (e: Konva.KonvaEventObject<DragEvent>) => {
    updateElement(id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const newScale = e.evt.deltaY < 0 ? scale * scaleBy : scale / scaleBy;
    const limitedScale = Math.max(0.5, Math.min(3, newScale));
    setScale(limitedScale);
  };

  // Determine cursor style based on tool
  const getCursorStyle = () => {
    if (tool === 'ability' && selectedAbilityIcon) return 'crosshair';
    if (tool === 'agent' && selectedAgentId) return 'crosshair';
    if (tool === 'pen') return 'crosshair';
    if (tool === 'text') return 'text';
    if (tool === 'select') return 'default';
    return 'crosshair';
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-gray-900 shadow-2xl rounded-lg border border-gray-700">
      <Stage
        ref={stageRef}
        width={containerSize.width}
        height={containerSize.height}
        className="bg-gray-800"
        scaleX={scale * autoScale}
        scaleY={scale * autoScale}
        x={stageOffset.x}
        y={stageOffset.y}
        draggable={true}
        dragButtons={[1]}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: getCursorStyle() }}
      >
        <Layer>
          {mapImageSrc && <MapImage src={mapImageSrc} rotation={mapRotation} />}

          {canvasData.elements.map((element) => {
            if (element.type === 'agent') {
              return (
                <AgentIcon
                  key={element.id}
                  element={element as AgentPlacement}
                  isSelected={element.id === selectedElementId || selectedElementIds.includes(element.id)}
                  isDraggable={tool === 'select' || selectedElementIds.includes(element.id) || element.id === selectedElementId}
                  onSelect={() => selectElement(element.id)}
                  onDragEnd={handleElementDragEnd(element.id)}
                />
              );
            }

            if (element.type === 'ability') {
              return (
                <AbilityIcon
                  key={element.id}
                  element={element as AbilityPlacement}
                  isSelected={element.id === selectedElementId || selectedElementIds.includes(element.id)}
                  isDraggable={tool === 'select' || selectedElementIds.includes(element.id) || element.id === selectedElementId}
                  onSelect={() => selectElement(element.id)}
                  onDragEnd={handleElementDragEnd(element.id)}
                />
              );
            }

            return (
              <DrawingElementRenderer
                key={element.id}
                element={element as DrawingElement}
                isSelected={element.id === selectedElementId || selectedElementIds.includes(element.id)}
                isDraggable={tool === 'select' || selectedElementIds.includes(element.id) || element.id === selectedElementId}
                showHover={tool === 'select'}
                onSelect={() => selectElement(element.id)}
                onDragEnd={handleElementDragEnd(element.id)}
                onTextEdit={(newText) => updateElement(element.id, { text: newText })}
              />
            );
          })}

          {currentShape && (
            <DrawingElementRenderer
              element={currentShape}
              isSelected={false}
              isDraggable={false}
              onSelect={() => { }}
              onDragEnd={() => { }}
            />
          )}

          {selectionBox && (
            <Rect
              x={selectionBox.x}
              y={selectionBox.y}
              width={selectionBox.width}
              height={selectionBox.height}
              stroke="#4299e1"
              strokeWidth={2 / scale}
              dash={[10 / scale, 5 / scale]}
              fill="rgba(66, 153, 225, 0.1)"
              perfectDrawEnabled={false}
              listening={false}
            />
          )}
        </Layer>
      </Stage>

      {!selectedMap && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <p className="text-white text-lg">Select a map to begin</p>
        </div>
      )}

      {selectedMap && (
        <>
          <div className={`absolute top-4 right-4 px-4 py-2 rounded-md font-bold text-white shadow-lg ${strategySide === 'attack' ? 'bg-red-600' : 'bg-blue-600'
            }`}>
            {strategySide === 'attack' ? '⚔️ ATTACK' : '🛡️ DEFENSE'}
          </div>

          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-md bg-gray-800 bg-opacity-90 text-white text-sm">
            Zoom: {Math.round(scale * 100)}%
          </div>

          <ElementPropertiesPanel />
        </>
      )}
    </div>
  );
}
