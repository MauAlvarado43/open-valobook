'use client';

import { Stage, Layer, Image as KonvaImage, Rect } from 'react-konva';
import { memo, useRef, useState, useEffect } from 'react';
import { useEditorStore } from '@/lib/store/editorStore';
import useImage from 'use-image';
import { DrawingElementRenderer } from './DrawingElementRenderer';
import { AgentIcon } from './AgentIcon';
import { AbilityIcon } from './AbilityIcon';
import { ElementPropertiesPanel } from './ElementPropertiesPanel';
import type { DrawingElement, AgentPlacement, AbilityPlacement } from '@/types/strategy';
import type Konva from 'konva';
import { useCanvasDrawing } from './canvas/useCanvasDrawing';

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
  const [scale, setScale] = useState(1);

  const {
    selectedMap,
    canvasData,
    tool,
    selectedElementId,
    selectedElementIds,
    selectedAgentId,
    selectedAbilityIcon,
    strategySide,
    updateElement,
    removeElement,
    undo,
    redo,
    selectElement
  } = useEditorStore();

  const {
    currentShape,
    selectionBox,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useCanvasDrawing(scale, autoScale, stageRef);

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

  const mapImageSrc = selectedMap ? `/assets/maps/${selectedMap}.png` : null;
  const baseRotation = selectedMap ? (mapRotations[selectedMap] || 0) : 0;
  const mapRotation = baseRotation + (strategySide === 'defense' ? 180 : 0);

  // Responsive scaling
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width: cw, height: ch } = containerRef.current.getBoundingClientRect();
        const s = Math.min(cw / 1024, ch / 1024);
        setAutoScale(s);
        setContainerSize({ width: cw, height: ch });
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

  const handleElementDragEnd = (id: string) => (e: Konva.KonvaEventObject<DragEvent>) => {
    updateElement(id, { x: e.target.x(), y: e.target.y() });
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const newScale = e.evt.deltaY < 0 ? scale * scaleBy : scale / scaleBy;
    const limitedScale = Math.max(0.5, Math.min(3, newScale));
    setScale(limitedScale);
  };

  const getCursorStyle = () => {
    if ((tool === 'ability' && selectedAbilityIcon) || (tool === 'agent' && selectedAgentId) || tool === 'pen' || tool === 'timer-path') return 'cursor-crosshair';
    if (tool === 'text') return 'cursor-text';
    return 'cursor-default';
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-gray-900 shadow-2xl rounded-lg border border-gray-700">
      <Stage
        ref={stageRef}
        width={containerSize.width}
        height={containerSize.height}
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
        className={`bg-gray-800 ${getCursorStyle()}`}
      >
        <Layer>
          {mapImageSrc && <MapImage src={mapImageSrc} rotation={mapRotation} />}

          {canvasData.elements.map((element) => {
            const isSelected = element.id === selectedElementId || selectedElementIds.includes(element.id);
            const isDraggable = tool === 'select' || isSelected;

            if (element.type === 'agent') {
              return (
                <AgentIcon
                  key={element.id}
                  element={element as AgentPlacement}
                  isSelected={isSelected}
                  isDraggable={isDraggable}
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
                  isSelected={isSelected}
                  isDraggable={isDraggable}
                  onSelect={() => selectElement(element.id)}
                  onDragEnd={handleElementDragEnd(element.id)}
                />
              );
            }

            return (
              <DrawingElementRenderer
                key={element.id}
                element={element as DrawingElement}
                isSelected={isSelected}
                isDraggable={isDraggable}
                showHover={tool === 'select'}
                onSelect={() => selectElement(element.id)}
                onDragEnd={handleElementDragEnd(element.id)}
                onTextEdit={(newText) => updateElement(element.id, { text: newText })}
              />
            );
          })}

          {currentShape && (
            <>
              {currentShape.type === 'agent' && (
                <AgentIcon
                  element={currentShape as AgentPlacement}
                  isSelected={false}
                  isDraggable={false}
                  onSelect={() => { }}
                  onDragEnd={() => { }}
                />
              )}
              {currentShape.type === 'ability' && (
                <AbilityIcon
                  element={currentShape as AbilityPlacement}
                  isSelected={false}
                  isDraggable={false}
                  onSelect={() => { }}
                  onDragEnd={() => { }}
                />
              )}
              {currentShape.type !== 'agent' && currentShape.type !== 'ability' && (
                <DrawingElementRenderer
                  element={currentShape as DrawingElement}
                  isSelected={false}
                  isDraggable={false}
                  onSelect={() => { }}
                  onDragEnd={() => { }}
                />
              )}
            </>
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
          <div className={`absolute top-4 right-4 px-4 py-2 rounded-md font-bold text-white shadow-lg ${strategySide === 'attack' ? 'bg-red-600' : 'bg-blue-600'}`}>
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
