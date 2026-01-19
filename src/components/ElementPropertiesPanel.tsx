'use client';

import { useEditorStore } from '@/lib/store/editorStore';
import type { DrawingElement, AgentPlacement, AbilityPlacement, StrategySide } from '@/types/strategy';
import { getAbilityDefinition, getMaxDimension, isFixedSize } from '@/lib/constants/abilityDefinitions';

const colors = [
  { name: 'Valorant Red', value: '#FF4655' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Cyan', value: '#00D4FF' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Orange', value: '#FF6B00' },
  { name: 'Purple', value: '#A855F7' },
];

const strokeWidths = [1, 2, 3, 4, 5, 6, 8, 10];

export function ElementPropertiesPanel() {
  const { selectedElementIds, canvasData, updateElement, removeElement } = useEditorStore();

  if (selectedElementIds.length === 0) return null;

  const selectedElements = canvasData.elements.filter((el) =>
    selectedElementIds.includes(el.id)
  ) as (DrawingElement | AgentPlacement | AbilityPlacement)[];

  if (selectedElements.length === 0) return null;

  // Get common properties
  const firstElement = selectedElements[0];

  const commonColor = selectedElements.every((el) => 'color' in el && (el as DrawingElement).color === (firstElement as DrawingElement).color)
    ? (firstElement as DrawingElement).color
    : null;

  const commonStrokeWidth = selectedElements.every(
    (el) => 'strokeWidth' in el && (el as DrawingElement).strokeWidth === (firstElement as DrawingElement).strokeWidth
  )
    ? (firstElement as DrawingElement).strokeWidth
    : null;

  const commonSide = selectedElements.every(
    (el) => 'side' in el && (el as AgentPlacement).side === (firstElement as AgentPlacement).side
  )
    ? (firstElement as AgentPlacement).side
    : null;

  const handleColorChange = (color: string) => {
    selectedElementIds.forEach((id) => {
      updateElement(id, { color });
    });
  };

  const handleStrokeWidthChange = (strokeWidth: number) => {
    selectedElementIds.forEach((id) => {
      updateElement(id, { strokeWidth });
    });
  };

  const handleSideChange = (side: StrategySide) => {
    selectedElementIds.forEach((id) => {
      updateElement(id, { side });
    });
  };

  const handleDelete = () => {
    selectedElementIds.forEach((id) => {
      removeElement(id);
    });
  };

  const hasDrawingElement = selectedElements.some(el => el.type !== 'agent' && el.type !== 'ability');
  const hasAgentOrAbility = selectedElements.some(el => el.type === 'agent' || el.type === 'ability');

  return (
    <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-95 rounded-lg shadow-2xl p-4 border border-gray-700 min-w-[300px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm">
          {selectedElementIds.length} element{selectedElementIds.length > 1 ? 's' : ''} selected
        </h3>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors"
        >
          Delete
        </button>
      </div>

      <div className="space-y-4">
        {/* Side Toggle (for Agents/Abilities) */}
        {hasAgentOrAbility && (
          <div>
            <label className="text-gray-300 text-xs font-medium mb-2 block">Team Side</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleSideChange('attack')}
                className={`flex-1 py-1.5 rounded text-xs font-bold transition ${commonSide === 'attack'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
              >
                Attack
              </button>
              <button
                onClick={() => handleSideChange('defense')}
                className={`flex-1 py-1.5 rounded text-xs font-bold transition ${commonSide === 'defense'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
              >
                Defense
              </button>
            </div>
          </div>
        )}

        {/* Color Picker (for drawing elements) */}
        {hasDrawingElement && (
          <div>
            <label className="text-gray-300 text-xs font-medium mb-2 block">Color</label>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorChange(color.value)}
                  className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${commonColor === color.value
                    ? 'border-white shadow-lg scale-110'
                    : 'border-gray-600'
                    }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Stroke Width */}
        {hasDrawingElement && (
          <div>
            <label className="text-gray-300 text-xs font-medium mb-2 block">
              Stroke Width {commonStrokeWidth ? `(${commonStrokeWidth}px)` : '(Mixed)'}
            </label>
            <div className="flex gap-1 flex-wrap">
              {strokeWidths.map((width) => (
                <button
                  key={width}
                  onClick={() => handleStrokeWidthChange(width)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${commonStrokeWidth === width
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                  {width}px
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text editing for single text element */}
        {selectedElementIds.length === 1 && firstElement.type === 'text' && (
          <div>
            <label className="text-gray-300 text-xs font-medium mb-2 block">Text Content</label>
            <input
              type="text"
              value={(firstElement as DrawingElement).text || ''}
              onChange={(e) => updateElement(firstElement.id, { text: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
              placeholder="Enter text..."
            />
          </div>
        )}

        {/* Font size for text elements */}
        {selectedElements.some((el) => el.type === 'text') && (
          <div>
            <label className="text-gray-300 text-xs font-medium mb-2 block">Font Size</label>
            <div className="flex gap-1 flex-wrap">
              {[12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    selectedElementIds.forEach((id) => {
                      const element = canvasData.elements.find((el) => el.id === id);
                      if (element && element.type === 'text') {
                        updateElement(id, { fontSize: size });
                      }
                    });
                  }}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${selectedElements.length === 1 && (firstElement as DrawingElement).fontSize === size
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Ability Specific Controls (Radius, Width, Height) */}
        {selectedElements.some((el) => el.type === 'ability') && (
          <div className="space-y-3 pt-2 border-t border-gray-800">
            {selectedElements.some((el) => el.type === 'ability' && ((el as AbilityPlacement).subType === 'smoke' || (el as AbilityPlacement).subType === 'area')) && (
              <div>
                {(() => {
                  const abilityEl = selectedElements.find(el => el.type === 'ability' && ('radius' in el)) as AbilityPlacement;
                  const def = getAbilityDefinition(abilityEl?.abilityName || abilityEl?.abilityIcon || '');
                  const fixed = isFixedSize(def, 'radius');

                  return (
                    <>
                      <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">
                        Radius {fixed ? '(Fixed)' : ''}
                      </label>
                      {!fixed && (
                        <>
                          <div className="flex gap-1 flex-wrap mb-2">
                            {[30, 45, 60, 80, 100, 150].map((r) => (
                              <button
                                key={r}
                                onClick={() => selectedElementIds.forEach(id => updateElement(id, { radius: r }))}
                                className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-[10px] transition-colors"
                              >
                                {r}
                              </button>
                            ))}
                          </div>
                          <input
                            type="range"
                            min="10"
                            max={getMaxDimension(def, 'radius')}
                            step="5"
                            title="Radius"
                            value={abilityEl?.radius || 60}
                            onChange={(e) => {
                              const radius = parseInt(e.target.value);
                              selectedElementIds.forEach(id => updateElement(id, { radius }));
                            }}
                            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />
                        </>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {hasAgentOrAbility && (
              <div>
                <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">Opacity</label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  title="Opacity"
                  value={(selectedElements.find(el => el.type === 'ability' && ('opacity' in el)) as AbilityPlacement)?.opacity || 0.4}
                  onChange={(e) => {
                    const opacity = parseFloat(e.target.value);
                    selectedElementIds.forEach(id => updateElement(id, { opacity }));
                  }}
                  className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            )}

            {/* Intermediate Points control for curved-wall */}
            {selectedElements.some((el) => el.type === 'ability' && (el as AbilityPlacement).subType === 'curved-wall') && (
              <div>
                <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">Intermediate Points</label>
                <div className="flex gap-1 flex-wrap">
                  {(() => {
                    const def = getAbilityDefinition(
                      (selectedElements.find(el => el.type === 'ability' && (el as AbilityPlacement).subType === 'curved-wall') as AbilityPlacement)?.abilityName ||
                      (selectedElements.find(el => el.type === 'ability' && (el as AbilityPlacement).subType === 'curved-wall') as AbilityPlacement)?.abilityIcon || ''
                    );
                    const maxIntermediatePoints = def?.maxIntermediatePoints ?? 10;
                    const options = [0, 1, 2, 3, 4, 5, 6, 8, 10].filter(n => n <= maxIntermediatePoints);
                    const currentCount = (selectedElements.find(el => el.type === 'ability' && (el as AbilityPlacement).subType === 'curved-wall') as AbilityPlacement)?.intermediatePoints ?? 0;

                    return options.map((num) => {
                      const isActive = currentCount === num;

                      return (
                        <button
                          key={num}
                          onClick={() => {
                            selectedElementIds.forEach(id => {
                              const el = selectedElements.find(e => e.id === id) as AbilityPlacement;
                              if (el && el.subType === 'curved-wall' && el.points) {
                                const oldPoints = [...el.points];
                                const oldCount = el.intermediatePoints ?? 0;

                                // Preserve start and end
                                const startX = oldPoints[0];
                                const startY = oldPoints[1];
                                const endX = oldPoints[oldPoints.length - 2];
                                const endY = oldPoints[oldPoints.length - 1];

                                const newPoints = [startX, startY];

                                if (num > 0) {
                                  // Interpolate new intermediate points from old shape
                                  for (let i = 1; i <= num; i++) {
                                    const t = i / (num + 1); // Position along the path (0 to 1)

                                    // Find corresponding position in old points
                                    const oldT = t * (oldCount + 1);
                                    const oldIndex = Math.floor(oldT);
                                    const fraction = oldT - oldIndex;

                                    let newX, newY;

                                    if (oldCount === 0 || oldIndex >= oldCount) {
                                      // Linear interpolation if no old points or beyond range
                                      newX = startX + (endX - startX) * t;
                                      newY = startY + (endY - startY) * t;
                                    } else {
                                      // Interpolate between old points
                                      const idx1 = oldIndex * 2;
                                      const idx2 = Math.min(idx1 + 2, oldPoints.length - 2);
                                      const x1 = oldPoints[idx1];
                                      const y1 = oldPoints[idx1 + 1];
                                      const x2 = oldPoints[idx2];
                                      const y2 = oldPoints[idx2 + 1];

                                      newX = x1 + (x2 - x1) * fraction;
                                      newY = y1 + (y2 - y1) * fraction;
                                    }

                                    newPoints.push(newX, newY);
                                  }
                                }

                                newPoints.push(endX, endY);
                                updateElement(id, { points: newPoints, intermediatePoints: num });
                              }
                            });
                          }}
                          className={`px-2 py-1 rounded text-[10px] transition-colors ${isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                            }`}
                        >
                          {num}
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
