'use client';

import { Stage, Layer, Image as KonvaImage, Rect } from 'react-konva';
import { useRef, useState, useEffect } from 'react';
import { useEditorStore } from '@/lib/store/editorStore';
import useImage from 'use-image';
import { DrawingElementRenderer } from './DrawingElementRenderer';
import { ElementPropertiesPanel } from './ElementPropertiesPanel';
import type { DrawingElement } from '@/types/strategy';
import type Konva from 'konva';

interface StrategyCanvasProps {
  width?: number;
  height?: number;
}

function MapImage({ src, rotation }: { src: string; rotation: number }) {
  const [image] = useImage(src);
  
  return (
    <KonvaImage 
      image={image} 
      width={1024} 
      height={768}
      rotation={rotation}
      offsetX={rotation !== 0 ? 1024 / 2 : 0}
      offsetY={rotation !== 0 ? 768 / 2 : 0}
      x={rotation !== 0 ? 1024 / 2 : 0}
      y={rotation !== 0 ? 768 / 2 : 0}
    />
  );
}

export function StrategyCanvas({ width = 1024, height = 768 }: StrategyCanvasProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const { 
    selectedMap, 
    canvasData, 
    tool, 
    selectedElementId,
    selectedElementIds,
    currentColor,
    strategySide,
    setTool,
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
  
  // Maps that need rotation to be displayed correctly
  // These rotations correct the base image orientation from the API
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
    
  // Base rotation + 180 degrees if defense side
  const baseRotation = selectedMap ? (mapRotations[selectedMap] || 0) : 0;
  const mapRotation = baseRotation + (strategySide === 'defense' ? 180 : 0);

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
        // Delete all selected elements
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
    // Only left click
    if (e.evt.button !== 0) return;
    
    const stage = e.target.getStage();
    if (!stage) return;
    
    const clickedOnStage = e.target === stage;
    const elementId = e.target.id();
    
    // Prevent stage dragging if not in select mode and didn't click on stage
    if (tool !== 'select' && !clickedOnStage) {
      stage.stopDrag();
    }
    
    // Shift+Click on stage: start selection box
    if (e.evt.shiftKey && clickedOnStage) {
      stage.stopDrag();
      const pos = stage.getPointerPosition();
      if (pos) {
        const adjustedPos = {
          x: (pos.x - stage.x()) / scale,
          y: (pos.y - stage.y()) / scale,
        };
        setIsSelecting(true);
        setSelectionBox({ x: adjustedPos.x, y: adjustedPos.y, width: 0, height: 0 });
      }
      return;
    }
    
    // Ctrl+Click: switch to select mode and select element
    if (e.evt.ctrlKey && !clickedOnStage && elementId) {
      stage.stopDrag();
      setTool('select');
      selectElement(elementId);
      return;
    }
    
    // Shift+Click on element: multi-select
    if (e.evt.shiftKey && !clickedOnStage && elementId) {
      stage.stopDrag();
      toggleElementSelection(elementId);
      return;
    }
    
    // Click on stage (background): clear selection
    if (clickedOnStage) {
      clearSelection();
      // Continue to drawing logic below if not in select mode
    }
    
    // Regular select mode
    if (tool === 'select') return;
    
    const pos = stage.getPointerPosition();
    if (!pos) return;
    
    // Adjust position for scale
    const adjustedPos = {
      x: (pos.x - stage.x()) / scale,
      y: (pos.y - stage.y()) / scale,
    };
    
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
    
    // Adjust position for scale
    const adjustedPos = {
      x: (pos.x - stage.x()) / scale,
      y: (pos.y - stage.y()) / scale,
    };
    
    // Update selection box
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

    if (tool === 'pen') {
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
    // Complete selection box
    if (isSelecting && selectionBox) {
      const box = {
        x1: Math.min(selectionBox.x, selectionBox.x + selectionBox.width),
        y1: Math.min(selectionBox.y, selectionBox.y + selectionBox.height),
        x2: Math.max(selectionBox.x, selectionBox.x + selectionBox.width),
        y2: Math.max(selectionBox.y, selectionBox.y + selectionBox.height),
      };
      
      // Find all elements within selection box
      canvasData.elements.forEach((element) => {
        if (element.type !== 'agent' && element.type !== 'ability') {
          const elem = element as DrawingElement;
          if (elem.x >= box.x1 && elem.x <= box.x2 && elem.y >= box.y1 && elem.y <= box.y2) {
            toggleElementSelection(elem.id);
          }
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
    
    // Limit zoom range
    const limitedScale = Math.max(0.5, Math.min(3, newScale));
    
    setScale(limitedScale);
  };
  
  return (
    <div className="relative border border-gray-300 rounded-lg overflow-hidden bg-gray-900">
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        className="bg-gray-800"
        scaleX={scale}
        scaleY={scale}
        draggable={true}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <Layer>
          {mapImageSrc && <MapImage src={mapImageSrc} rotation={mapRotation} />}
          
          {canvasData.elements.map((element) => {
            if (element.type === 'agent' || element.type === 'ability') {
              return null;
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
              onSelect={() => {}}
              onDragEnd={() => {}}
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
          <div className={`absolute top-4 right-4 px-4 py-2 rounded-md font-bold text-white shadow-lg ${
            strategySide === 'attack' ? 'bg-red-600' : 'bg-blue-600'
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
