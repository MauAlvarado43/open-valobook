'use client';

import { useEditorStore } from '@/lib/store/editorStore';
import type { DrawingElement, AgentPlacement, AbilityPlacement } from '@/types/strategy';

// Sub-components
import { PropertiesHeader } from '@/components/properties/PropertiesHeader';
import { BaseProperties } from '@/components/properties/BaseProperties';
import { DrawingProperties } from '@/components/properties/DrawingProperties';
import { TextProperties } from '@/components/properties/TextProperties';
import { AbilityProperties } from '@/components/properties/AbilityProperties';
import { VisionConeProperties } from '@/components/properties/VisionConeProperties';
import { GraphicProperties } from '@/components/properties/GraphicProperties';

export function ElementPropertiesPanel() {
  const { selectedElementIds, canvasData, updateElement, removeElement } = useEditorStore();

  if (selectedElementIds.length === 0) return null;

  const selectedElements = canvasData.elements.filter((el) =>
    selectedElementIds.includes(el.id)
  ) as (DrawingElement | AgentPlacement | AbilityPlacement)[];

  if (selectedElements.length === 0) return null;

  const firstElement = selectedElements[0];

  // Common property calculations
  const commonColor = selectedElements.every(
    (el) => 'color' in el && (el as DrawingElement).color === (firstElement as DrawingElement).color
  )
    ? (firstElement as DrawingElement).color || null
    : null;

  const commonStrokeWidth = selectedElements.every(
    (el) =>
      'strokeWidth' in el &&
      (el as DrawingElement).strokeWidth === (firstElement as DrawingElement).strokeWidth
  )
    ? (firstElement as DrawingElement).strokeWidth || null
    : null;

  const commonSide = selectedElements.every(
    (el) => 'side' in el && (el as AgentPlacement).side === (firstElement as AgentPlacement).side
  )
    ? (firstElement as AgentPlacement).side || null
    : null;

  const commonOpacity = selectedElements.every(
    (el) =>
      'opacity' in el && (el as DrawingElement).opacity === (firstElement as DrawingElement).opacity
  )
    ? (firstElement as DrawingElement).opacity ?? null
    : null;

  const commonFontSize = selectedElements.every(
    (el) =>
      'fontSize' in el &&
      (el as DrawingElement).fontSize === (firstElement as DrawingElement).fontSize
  )
    ? (firstElement as DrawingElement).fontSize || null
    : null;

  // Handlers
  const handleUpdateMany = (
    updates: Partial<DrawingElement | AgentPlacement | AbilityPlacement>
  ) => {
    selectedElementIds.forEach((id) => updateElement(id, updates));
  };

  const handleDelete = () => {
    selectedElementIds.forEach((id) => removeElement(id));
  };

  const hasDrawingElement = selectedElements.some(
    (el) => el.type !== 'agent' && el.type !== 'ability'
  );
  const showDrawingProperties = selectedElements.some(
    (el) =>
      el.type !== 'agent' &&
      el.type !== 'ability' &&
      el.type !== 'image' &&
      !(el.type === 'icon' && (el as DrawingElement).iconType === 'spike')
  );

  const abilityElements = selectedElements.filter(
    (el) => el.type === 'ability'
  ) as AbilityPlacement[];
  const textElements = selectedElements.filter((el) => el.type === 'text') as DrawingElement[];

  return (
    <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-95 rounded-lg shadow-2xl p-4 border border-gray-700 min-w-[300px] max-h-[80vh] overflow-y-auto custom-scrollbar">
      <PropertiesHeader count={selectedElementIds.length} onDelete={handleDelete} />

      <div className="space-y-4">
        {/* Base Properties: Side & Opacity */}
        <BaseProperties
          side={commonSide}
          onSideChange={(side) => {
            // Only agents and abilities have side
            selectedElementIds.forEach((id) => {
              const el = canvasData.elements.find((e) => e.id === id);
              if (el?.type === 'agent' || el?.type === 'ability') {
                updateElement(id, { side });
              }
            });
          }}
          opacity={commonOpacity}
          onOpacityChange={(opacity) => handleUpdateMany({ opacity })}
        />

        {/* Drawing Properties: Color & Stroke */}
        {showDrawingProperties && (
          <DrawingProperties
            color={commonColor}
            onColorChange={(color) => {
              selectedElementIds.forEach((id) => {
                const el = canvasData.elements.find((e) => e.id === id) as DrawingElement;
                // Skip icons that are spikes and images
                if (el && !(el.type === 'icon' && el.iconType === 'spike') && el.type !== 'image') {
                  updateElement(id, { color });
                }
              });
            }}
            strokeWidth={commonStrokeWidth}
            onStrokeWidthChange={(strokeWidth) => {
              selectedElementIds.forEach((id) => {
                const el = canvasData.elements.find((e) => e.id === id) as DrawingElement;
                if (el && !(el.type === 'icon' && el.iconType === 'spike') && el.type !== 'image') {
                  updateElement(id, { strokeWidth });
                }
              });
            }}
          />
        )}

        {/* Text Properties */}
        {textElements.length > 0 && (
          <TextProperties
            text={(firstElement as DrawingElement).text || ''}
            onTextChange={(text) => handleUpdateMany({ text })}
            fontSize={commonFontSize}
            onFontSizeChange={(fontSize) => handleUpdateMany({ fontSize })}
            showTextEdit={selectedElementIds.length === 1 && firstElement.type === 'text'}
          />
        )}

        {/* Ability Properties */}
        {abilityElements.length > 0 && (
          <AbilityProperties
            elements={abilityElements}
            onRadiusChange={(radius) => handleUpdateMany({ radius })}
            onIntermediatePointsChange={(num) => {
              // Special logic for curved wall points interpolation
              selectedElementIds.forEach((id) => {
                const el = selectedElements.find((e) => e.id === id) as AbilityPlacement;
                if (el && el.subType === 'curved-wall' && el.points) {
                  const pts = [...el.points];
                  const startX = pts[0],
                    startY = pts[1];
                  const endX = pts[pts.length - 2],
                    endY = pts[pts.length - 1];
                  const newPoints = [startX, startY];
                  for (let i = 1; i <= num; i++) {
                    const t = i / (num + 1);
                    newPoints.push(startX + (endX - startX) * t, startY + (endY - startY) * t);
                  }
                  newPoints.push(endX, endY);
                  updateElement(id, { points: newPoints, intermediatePoints: num });
                }
              });
            }}
          />
        )}

        {/* Vision Cone Properties */}
        {selectedElementIds.length === 1 && firstElement.type === 'vision-cone' && (
          <VisionConeProperties
            element={firstElement as DrawingElement}
            onRadiusChange={(radius) => updateElement(firstElement.id, { radius })}
            onAngleChange={(angle) => updateElement(firstElement.id, { angle })}
            onRotationChange={(rotation) => updateElement(firstElement.id, { rotation })}
          />
        )}

        {/* Icon & Image Properties */}
        {selectedElementIds.length === 1 &&
          (firstElement.type === 'icon' || firstElement.type === 'image') && (
            <GraphicProperties
              element={firstElement as DrawingElement}
              onUpdate={(updates) => updateElement(firstElement.id, updates)}
            />
          )}

        {/* Rotation for Drawing Elements (Batch) */}
        {hasDrawingElement &&
          firstElement.type !== 'vision-cone' &&
          firstElement.type !== 'timer-path' && (
            <div className="pt-2 border-t border-gray-800">
              <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">
                Global Rotation ({(firstElement as DrawingElement).rotation || 0}°)
              </label>
              <div className="flex gap-2">
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  title="Rotate"
                  value={(firstElement as DrawingElement).rotation || 0}
                  onChange={(e) => handleUpdateMany({ rotation: parseInt(e.target.value) })}
                  className="flex-1 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-500 my-auto"
                />
                <input
                  type="number"
                  min="0"
                  max="360"
                  title="Rotation value"
                  value={(firstElement as DrawingElement).rotation || 0}
                  onChange={(e) => handleUpdateMany({ rotation: parseInt(e.target.value) || 0 })}
                  className="w-12 bg-gray-800 text-white text-[10px] rounded border border-gray-600 px-1 py-0.5 text-center"
                />
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
