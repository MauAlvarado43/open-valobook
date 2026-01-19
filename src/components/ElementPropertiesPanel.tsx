'use client';

import { useEditorStore } from '@/lib/store/editorStore';
import { Flag, TriangleAlert, Info, Target } from 'lucide-react';
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
                title="Set team to Attack"
                className={`flex-1 py-1.5 rounded text-xs font-bold transition ${commonSide === 'attack'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
              >
                Attack
              </button>
              <button
                onClick={() => handleSideChange('defense')}
                title="Set team to Defense"
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
                          <div className="flex gap-2 items-center">
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
                              className="flex-1 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <input
                              type="number"
                              min="10"
                              max={getMaxDimension(def, 'radius')}
                              aria-label="Radius value"
                              title="Enter numeric radius"
                              value={abilityEl?.radius || 60}
                              onChange={(e) => {
                                const radius = parseInt(e.target.value);
                                selectedElementIds.forEach(id => updateElement(id, { radius }));
                              }}
                              className="w-12 bg-gray-800 text-white text-[10px] rounded border border-gray-600 px-1 py-0.5 text-center"
                            />
                          </div>
                        </>
                      )}
                    </>
                  );
                })()}
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

        {hasAgentOrAbility && (
          <div>
            <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">Opacity</label>
            <div className="flex gap-2 items-center">
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
                className="flex-1 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <input
                type="number"
                min="0.1"
                max="1.0"
                step="0.05"
                title="Opacity Value"
                value={(selectedElements.find(el => el.type === 'ability' && ('opacity' in el)) as AbilityPlacement)?.opacity || 0.4}
                onChange={(e) => {
                  const opacity = parseFloat(e.target.value);
                  selectedElementIds.forEach(id => updateElement(id, { opacity }));
                }}
                className="w-12 bg-gray-800 text-white text-[10px] rounded border border-gray-600 px-1 py-0.5 text-center"
              />
            </div>
          </div>
        )}
        {/* Vision Cone Controls */}
        {selectedElementIds.length === 1 && firstElement.type === 'vision-cone' && (
          <div className="space-y-4 pt-2 border-t border-gray-800">
            <div>
              <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">Length</label>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="5"
                  aria-label="Vision Cone Length"
                  title="Adjust the length of the vision cone"
                  value={(firstElement as DrawingElement).radius || 150}
                  onChange={(e) => updateElement(firstElement.id, { radius: parseInt(e.target.value) })}
                  className="flex-1 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <input
                  type="number"
                  min="50"
                  max="500"
                  step="5"
                  aria-label="Vision Cone Length value"
                  title="Enter numeric length"
                  value={(firstElement as DrawingElement).radius || 150}
                  onChange={(e) => updateElement(firstElement.id, { radius: parseInt(e.target.value) })}
                  className="w-12 bg-gray-800 text-white text-[10px] rounded border border-gray-600 px-1 py-0.5 text-center"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">Angle ({(firstElement as DrawingElement).angle || 90}°)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="10"
                  max="360"
                  step="5"
                  aria-label="Vision Cone Angle"
                  title="Adjust the angle of the vision cone"
                  value={(firstElement as DrawingElement).angle || 90}
                  onChange={(e) => updateElement(firstElement.id, { angle: parseInt(e.target.value) })}
                  className="flex-1 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <input
                  type="number"
                  min="10"
                  max="360"
                  step="5"
                  aria-label="Vision Cone Angle value"
                  title="Enter numeric angle"
                  value={(firstElement as DrawingElement).angle || 90}
                  onChange={(e) => updateElement(firstElement.id, { angle: parseInt(e.target.value) })}
                  className="w-12 bg-gray-800 text-white text-[10px] rounded border border-gray-600 px-1 py-0.5 text-center"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">Direction ({(firstElement as DrawingElement).rotation || 0}°)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  aria-label="Vision Cone Direction"
                  title="Adjust the direction of the vision cone"
                  value={(firstElement as DrawingElement).rotation || 0}
                  onChange={(e) => updateElement(firstElement.id, { rotation: parseInt(e.target.value) })}
                  className="flex-1 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <input
                  type="number"
                  min="0"
                  max="360"
                  step="5"
                  aria-label="Vision Cone Direction value"
                  title="Enter numeric direction"
                  value={(firstElement as DrawingElement).rotation || 0}
                  onChange={(e) => updateElement(firstElement.id, { rotation: parseInt(e.target.value) })}
                  className="w-12 bg-gray-800 text-white text-[10px] rounded border border-gray-600 px-1 py-0.5 text-center"
                />
              </div>
            </div>
          </div>
        )}

        {/* Icon & Image Controls */}
        {selectedElementIds.length === 1 && (firstElement.type === 'icon' || firstElement.type === 'image') && (
          <div className="space-y-4 pt-2 border-t border-gray-800">
            {firstElement.type === 'icon' && (
              <div>
                <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">Icon Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['spike', 'flag', 'danger', 'warning'] as const).map((type) => {
                    let Icon;
                    switch (type) {
                      case 'spike': Icon = Target; break;
                      case 'flag': Icon = Flag; break;
                      case 'danger': Icon = TriangleAlert; break;
                      case 'warning': Icon = Info; break;
                      default: Icon = Flag;
                    }
                    return (
                      <button
                        key={type}
                        onClick={() => updateElement(firstElement.id, { iconType: type })}
                        className={`py-2 rounded flex flex-col items-center gap-1 transition-colors ${(firstElement as DrawingElement).iconType === type
                          ? 'bg-blue-600 text-white shadow-inner'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          }`}
                        title={type.charAt(0).toUpperCase() + type.slice(1)}
                      >
                        {type === 'spike' ? (
                          <img src="/assets/icons/spike.png" alt="Spike" className="w-4 h-4 object-contain" />
                        ) : (
                          <Icon size={16} />
                        )}
                        <span className="text-[8px] uppercase font-bold">{type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {firstElement.type === 'image' && (
              <div>
                <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">Custom Image</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    aria-label="Upload Custom Image"
                    title="Select an image file from your computer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const dataUrl = event.target?.result as string;
                          updateElement(firstElement.id, { imageUrl: dataUrl });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
                  />
                  <input
                    type="text"
                    placeholder="or enter URL..."
                    aria-label="Custom Image URL"
                    title="Enter the URL of an image"
                    value={(firstElement as DrawingElement).imageUrl || ''}
                    onChange={(e) => updateElement(firstElement.id, { imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-xs"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">Width</label>
                <input
                  type="number"
                  aria-label="Element Width"
                  title="Adjust the width of the element"
                  value={(firstElement as DrawingElement).width || 40}
                  onChange={(e) => updateElement(firstElement.id, { width: parseInt(e.target.value) })}
                  className="w-full px-2 py-1 bg-gray-800 text-white rounded border border-gray-600 text-xs"
                />
              </div>
              <div>
                <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">Height</label>
                <input
                  type="number"
                  aria-label="Element Height"
                  title="Adjust the height of the element"
                  value={(firstElement as DrawingElement).height || 40}
                  onChange={(e) => updateElement(firstElement.id, { height: parseInt(e.target.value) })}
                  className="w-full px-2 py-1 bg-gray-800 text-white rounded border border-gray-600 text-xs"
                />
              </div>
            </div>

            {/* Redundant individual rotation controls removed */}
          </div>
        )}

        {/* Generic Rotation and Opacity Control for Drawing Elements */}
        {hasDrawingElement && (
          <div className="pt-2 border-t border-gray-800 space-y-4">
            <div>
              <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">
                Rotation ({(firstElement as DrawingElement).rotation || 0}°)
              </label>
              <div className="flex gap-2">
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  aria-label="Element Rotation"
                  title="Rotate the selected elements"
                  value={(firstElement as DrawingElement).rotation || 0}
                  onChange={(e) => {
                    const rotation = parseInt(e.target.value);
                    selectedElementIds.forEach(id => updateElement(id, { rotation }));
                  }}
                  className="flex-1 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-500 my-auto"
                />
                <input
                  type="number"
                  min="0"
                  max="360"
                  aria-label="Element Rotation value"
                  title="Enter numeric rotation"
                  value={(firstElement as DrawingElement).rotation || 0}
                  onChange={(e) => {
                    const rotation = parseInt(e.target.value) || 0;
                    selectedElementIds.forEach(id => updateElement(id, { rotation }));
                  }}
                  className="w-12 bg-gray-800 text-white text-[10px] rounded border border-gray-600 px-1 py-0.5 text-center"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">Opacity</label>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  aria-label="Element Opacity"
                  title="Adjust the opacity of the selected elements"
                  value={(firstElement as DrawingElement).opacity !== undefined ? (firstElement as DrawingElement).opacity : 1.0}
                  onChange={(e) => {
                    const opacity = parseFloat(e.target.value);
                    selectedElementIds.forEach(id => updateElement(id, { opacity }));
                  }}
                  className="flex-1 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <input
                  type="number"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  aria-label="Element Opacity value"
                  title="Enter numeric opacity"
                  value={(firstElement as DrawingElement).opacity !== undefined ? (firstElement as DrawingElement).opacity : 1.0}
                  onChange={(e) => {
                    const opacity = parseFloat(e.target.value);
                    selectedElementIds.forEach(id => updateElement(id, { opacity }));
                  }}
                  className="w-12 bg-gray-800 text-white text-[10px] rounded border border-gray-600 px-1 py-0.5 text-center"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
