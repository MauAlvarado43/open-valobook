import React, { useState, useEffect, useRef } from 'react';

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

interface DrawingPropertiesProps {
  color: string | null;
  onColorChange: (color: string) => void;
  strokeWidth: number | null;
  onStrokeWidthChange: (width: number) => void;
}

export function DrawingProperties({ color, onColorChange, strokeWidth, onStrokeWidthChange }: DrawingPropertiesProps) {
  const [localColor, setLocalColor] = useState(color || '#FF4655');
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (color) setLocalColor(color);
  }, [color]);

  const handleColorChange = (newColor: string) => {
    setLocalColor(newColor);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      onColorChange(newColor);
    }, 50);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-gray-300 text-xs font-medium mb-2 block">Color</label>
        <div className="flex gap-2 flex-wrap">
          {colors.map((c) => (
            <button
              key={c.value}
              onClick={() => onColorChange(c.value)}
              className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${color === c.value
                ? 'border-white shadow-lg scale-110'
                : 'border-gray-600'
                }`}
              /* eslint-disable-next-line react/forbid-component-props */
              style={{ backgroundColor: c.value }}
              title={c.name}
              aria-label={`Select ${c.name}`}
            />
          ))}
          <div className="relative group ml-1">
            <input
              type="color"
              id="custom-color-properties"
              value={localColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer z-10"
              title="Custom color"
            />
            <div className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-all ${color && !colors.some(c => c.value === color)
              ? 'border-white shadow-lg scale-110 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
              : 'border-gray-600 group-hover:border-gray-400 bg-gray-700'
              }`}>
              <span className="text-white text-[10px] font-bold">HEX</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="text-gray-300 text-xs font-medium mb-2 block">
          Stroke Width {strokeWidth ? `(${strokeWidth}px)` : '(Mixed)'}
        </label>
        <div className="flex gap-1 flex-wrap">
          {strokeWidths.map((w) => (
            <button
              key={w}
              onClick={() => onStrokeWidthChange(w)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${strokeWidth === w
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              {w}px
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
