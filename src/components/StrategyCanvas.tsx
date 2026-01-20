'use client';

import { Stage, Layer, Image as KonvaImage, Rect, Group } from 'react-konva';
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
import type { EditorState } from '@/lib/store/editorStore';

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
      offsetX={512}
      offsetY={512}
      x={512}
      y={512}
      name="map-image"
      listening={false}
      perfectDrawEnabled={false}
    />
  );
});

export function StrategyCanvas({}: StrategyCanvasProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 1024, height: 1024 });
  const [autoScale, setAutoScale] = useState(1);
  const [stageOffset, setStageOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);

  const {
    selectedMap,
    canvasData,
    tool,
    selectedElementId,
    selectedElementIds,
    selectedAgentId,
    selectedAbilityIcon,
    strategySide,
    setStrategySide,
    updateElement,
    removeElement,
    undo,
    redo,
    selectElement,
    setTool,
    saveToLibrary,
    strategyName,
    exportAsImage,
    clearCanvas,
    setStatus,
    setConfirmModal,
  } = useEditorStore();

  const { currentShape, selectionBox, handleMouseDown, handleMouseMove, handleMouseUp } =
    useCanvasDrawing(scale, autoScale, stageRef, isPanning);

  // Maps that need rotation to be displayed correctly
  const mapRotations: Record<string, number> = {
    abyss: 90,
    ascent: 90,
    bind: 0,
    breeze: 0,
    corrode: 90,
    fracture: 0,
    haven: 90,
    icebox: 270,
    lotus: 0,
    pearl: 0,
    split: 90,
    sunset: 0,
  };

  const mapImageSrc = selectedMap ? `/assets/maps/${selectedMap}.png` : null;
  const baseRotation = selectedMap ? mapRotations[selectedMap] || 0 : 0;
  const sideRotation = strategySide === 'defense' ? 180 : 0;

  // Responsive scaling
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width: cw, height: ch } = containerRef.current.getBoundingClientRect();
        const s = Math.min(cw / 1024, ch / 1024);
        setAutoScale(s);
        setContainerSize({ width: cw, height: ch });
        setStageOffset({
          x: (cw - 1024 * s) / 2,
          y: (ch - 1024 * s) / 2,
        });
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Force cursor update when isPanning changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.cursor = isPanning ? 'grabbing' : 'default';
    }
  }, [isPanning]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        if (e.key === 'Escape') {
          (document.activeElement as HTMLElement).blur();
        }
        return;
      }

      // System Actions
      if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey || e.altKey) {
          redo();
          setStatus({ type: 'success', msg: 'Redo' }, 1000);
        } else {
          undo();
          setStatus({ type: 'success', msg: 'Undo' }, 1000);
        }
      } else if (e.ctrlKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
        setStatus({ type: 'success', msg: 'Redo' }, 1000);
      } else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z') {
        // Explicitly handle Ctrl+Shift+Z for some layouts
        e.preventDefault();
        redo();
        setStatus({ type: 'success', msg: 'Redo' }, 1000);
      } else if (e.ctrlKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveToLibrary();
        setStatus({ type: 'success', msg: 'Strategy Saved' });
      } else if (e.ctrlKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        exportAsImage();
        setStatus({ type: 'loading', msg: 'Exporting...' });
      } else if (e.key === 'Delete') {
        e.preventDefault();
        if (selectedElementIds.length > 0 || selectedElementId) {
          if (selectedElementIds.length > 0) {
            selectedElementIds.forEach((id) => removeElement(id));
          } else if (selectedElementId) {
            removeElement(selectedElementId);
          }
          setStatus({ type: 'success', msg: 'Elements Deleted' }, 1000);
        }
      } else if (e.shiftKey && e.key === 'Escape') {
        e.preventDefault();
        setConfirmModal({
          title: 'Clear Canvas',
          message: 'Are you sure you want to clear all strategy elements?',
          onConfirm: clearCanvas,
        });
      } else if (e.key === 'Tab') {
        e.preventDefault();
        setStrategySide(strategySide === 'attack' ? 'defense' : 'attack');
      } else if (e.key === 'Control') {
        setTool('select');
        setStatus({ type: 'success', msg: 'SELECT Tool Active' }, 800);
      }

      // Tool Selection
      const keyMap: Record<string, EditorState['tool']> = {
        '1': 'pen',
        '2': 'timer-path',
        '3': 'line',
        '4': 'arrow',
        '5': 'circle',
        '6': 'rectangle',
        '7': 'vision-cone',
        '8': 'icon',
        '9': 'image',
        '0': 'text',
      };
      const key = e.key.toLowerCase();
      if (keyMap[key] && !e.ctrlKey && !e.altKey && !e.metaKey) {
        setTool(keyMap[key]);
        setStatus({ type: 'success', msg: `${keyMap[key].toUpperCase()} Active` }, 800);
      } else if (key === 's' && !e.ctrlKey) {
        // Checking for 's' without modifiers just in case, though usually ctrl+s is save.
        // Actually user didn't ask to remove 's'. But let's keep previous logic if possible, or simple.
        // Previous logic had 'v' for select, etc. replacing with numbers.
        saveToLibrary();
        setStatus({ type: 'success', msg: 'Strategy Saved' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    undo,
    redo,
    selectedElementId,
    selectedElementIds,
    removeElement,
    setTool,
    saveToLibrary,
    strategyName,
    exportAsImage,
    clearCanvas,
    setStatus,
    setConfirmModal,
  ]);

  // Image Export Listener
  useEffect(() => {
    const handleExport = async (e: Event) => {
      const type = e.type === 'canvas:export:pdf' ? 'pdf' : 'png';

      if (!stageRef.current) return;

      const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });

      if (window.electron?.saveFileDialog) {
        try {
          let exportData = dataUrl;

          if (type === 'pdf') {
            const { jsPDF } = await import('jspdf');
            const pdf = new jsPDF({
              orientation: 'landscape',
              unit: 'px',
              format: [stageRef.current.width() * 2, stageRef.current.height() * 2],
            });
            pdf.addImage(
              dataUrl,
              'PNG',
              0,
              0,
              stageRef.current.width() * 2,
              stageRef.current.height() * 2
            );
            exportData = pdf.output('datauristring').split(',')[1];
          }

          const result = await window.electron.saveFileDialog(exportData, true, type);
          if (result) {
            setStatus({ type: 'success', msg: `${type.toUpperCase()} Saved Successfully` });
          } else {
            setStatus(null);
          }
        } catch (error) {
          console.error('Export failed:', error);
          setStatus({ type: 'error', msg: 'Export Failed' });
        }
      }
    };

    window.addEventListener('canvas:export', handleExport);
    window.addEventListener('canvas:export:pdf', handleExport);
    return () => {
      window.removeEventListener('canvas:export', handleExport);
      window.removeEventListener('canvas:export:pdf', handleExport);
    };
  }, []);

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
    if (isPanning) return 'cursor-grabbing';
    if (tool === 'select') return 'cursor-default';
    if (
      (tool === 'ability' && selectedAbilityIcon) ||
      (tool === 'agent' && selectedAgentId) ||
      tool === 'pen' ||
      tool === 'timer-path' ||
      tool === 'line' ||
      tool === 'arrow' ||
      tool === 'circle' ||
      tool === 'rectangle' ||
      tool === 'vision-cone' ||
      tool === 'icon' ||
      tool === 'image'
    )
      return 'cursor-crosshair';
    if (tool === 'text') return 'cursor-text';
    return 'cursor-default';
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gray-900 shadow-2xl rounded-lg border border-gray-700"
      style={{ cursor: isPanning ? 'grabbing' : 'default' }}
    >
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
        onMouseDown={(e) => {
          if (e.evt.button === 1) setIsPanning(true);
          handleMouseDown(e);
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={(e) => {
          if (e.evt.button === 1) setIsPanning(false);
          handleMouseUp();
        }}
        onWheel={handleWheel}
        onDragStart={(e) => {
          if (e.target === stageRef.current) setIsPanning(true);
        }}
        onDragEnd={(e) => {
          if (e.target === stageRef.current) setIsPanning(false);
        }}
        onContextMenu={(e) => {
          e.evt.preventDefault();
        }}
        className={`bg-gray-800 transition-colors ${getCursorStyle()}`}
      >
        <Layer>
          <Group x={512} y={512} offsetX={512} offsetY={512} rotation={sideRotation}>
            {mapImageSrc && <MapImage src={mapImageSrc} rotation={baseRotation} />}

            {canvasData.elements.map((element) => {
              const isSelected =
                element.id === selectedElementId || selectedElementIds.includes(element.id);
              const isDraggable = (tool === 'select' || isSelected) && !isPanning;

              if (element.type === 'agent') {
                return (
                  <AgentIcon
                    key={element.id}
                    element={element as AgentPlacement}
                    isSelected={isSelected}
                    isDraggable={isDraggable}
                    onSelect={() => selectElement(element.id)}
                    onDragEnd={handleElementDragEnd(element.id)}
                    rotationOffset={sideRotation}
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
                    rotationOffset={sideRotation}
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
                  rotationOffset={sideRotation}
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
                    onSelect={() => {}}
                    onDragEnd={() => {}}
                    rotationOffset={sideRotation}
                  />
                )}
                {currentShape.type === 'ability' && (
                  <AbilityIcon
                    element={currentShape as AbilityPlacement}
                    isSelected={false}
                    isDraggable={false}
                    onSelect={() => {}}
                    onDragEnd={() => {}}
                    rotationOffset={sideRotation}
                  />
                )}
                {currentShape.type !== 'agent' && currentShape.type !== 'ability' && (
                  <DrawingElementRenderer
                    element={currentShape as DrawingElement}
                    isSelected={false}
                    isDraggable={false}
                    onSelect={() => {}}
                    onDragEnd={() => {}}
                    rotationOffset={sideRotation}
                  />
                )}
              </>
            )}
          </Group>

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
          <div
            className={`absolute top-4 right-4 px-4 py-2 rounded-md font-bold text-white shadow-lg ${strategySide === 'attack' ? 'bg-red-600' : 'bg-blue-600'}`}
          >
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
