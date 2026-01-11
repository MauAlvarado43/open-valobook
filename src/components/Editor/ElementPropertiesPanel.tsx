'use client';

import { useEditorStore } from '@/lib/store/editorStore';
import type { DrawingElement } from '@/types/strategy';

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
  ) as DrawingElement[];

  if (selectedElements.length === 0) return null;

  // Get common properties
  const firstElement = selectedElements[0];
  const commonColor = selectedElements.every((el) => el.color === firstElement.color)
    ? firstElement.color
    : null;
  const commonStrokeWidth = selectedElements.every(
    (el) => el.strokeWidth === firstElement.strokeWidth
  )
    ? firstElement.strokeWidth
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

  const handleDelete = () => {
    selectedElementIds.forEach((id) => {
      removeElement(id);
    });
  };

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

      <div className="space-y-3">
        {/* Color Picker */}
        <div>
          <label className="text-gray-300 text-xs font-medium mb-2 block">Color</label>
          <div className="flex gap-2 flex-wrap">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorChange(color.value)}
                className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                  commonColor === color.value
                    ? 'border-white shadow-lg scale-110'
                    : 'border-gray-600'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Stroke Width */}
        <div>
          <label className="text-gray-300 text-xs font-medium mb-2 block">
            Stroke Width {commonStrokeWidth ? `(${commonStrokeWidth}px)` : '(Mixed)'}
          </label>
          <div className="flex gap-1 flex-wrap">
            {strokeWidths.map((width) => (
              <button
                key={width}
                onClick={() => handleStrokeWidthChange(width)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  commonStrokeWidth === width
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {width}px
              </button>
            ))}
          </div>
        </div>

        {/* Text editing for single text element */}
        {selectedElementIds.length === 1 && firstElement.type === 'text' && (
          <div>
            <label className="text-gray-300 text-xs font-medium mb-2 block">Text Content</label>
            <input
              type="text"
              value={firstElement.text || ''}
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
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    selectedElements.length === 1 && firstElement.fontSize === size
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
      </div>
    </div>
  );
}
