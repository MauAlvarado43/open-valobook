'use client';

import { useEditorStore } from '@/lib/store/editorStore';
import type { EditorState } from '@/lib/store/editorStore';
import { MousePointer2, Minus, ArrowRight, Circle, Square, Type, Pencil, Trash2 } from 'lucide-react';

export function Toolbar() {
  const { tool, setTool, strategySide, setStrategySide, clearCanvas, currentColor, setCurrentColor } = useEditorStore();
  
  const tools = [
    { id: 'select', label: 'Select', Icon: MousePointer2 },
    { id: 'pen', label: 'Pen', Icon: Pencil },
    { id: 'line', label: 'Line', Icon: Minus },
    { id: 'arrow', label: 'Arrow', Icon: ArrowRight },
    { id: 'circle', label: 'Circle', Icon: Circle },
    { id: 'rectangle', label: 'Rectangle', Icon: Square },
    { id: 'text', label: 'Text', Icon: Type },
  ] as const;

  const colors = [
    { value: '#FF4655', label: 'Valorant Red' },
    { value: '#FFFFFF', label: 'White' },
    { value: '#00D4FF', label: 'Cyan' },
    { value: '#FFFF00', label: 'Yellow' },
    { value: '#00FF00', label: 'Green' },
    { value: '#FF6B00', label: 'Orange' },
    { value: '#A855F7', label: 'Purple' },
  ];
  
  return (
    <div className="p-4 border-b border-gray-700 bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setStrategySide('attack')}
            className={`px-4 py-2 rounded-md font-medium transition ${
              strategySide === 'attack'
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Attack
          </button>
          <button
            onClick={() => setStrategySide('defense')}
            className={`px-4 py-2 rounded-md font-medium transition ${
              strategySide === 'defense'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Defense
          </button>
        </div>
        
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition flex items-center gap-2"
        >
          <Trash2 size={18} />
          Clear Canvas
        </button>
      </div>
      
      <div className="flex gap-2 flex-wrap items-center">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id as EditorState['tool'])}
            className={`px-4 py-2 rounded-md font-medium transition flex items-center gap-2 ${
              tool === t.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title={t.label}
          >
            <t.Icon size={18} />
            <span className="text-sm">{t.label}</span>
          </button>
        ))}
        
        <div className="h-8 w-px bg-gray-600 mx-2" />
        
        <div className="flex gap-1 items-center">
          <span className="text-gray-400 text-sm mr-2">Color:</span>
          {colors.map((c) => (
            <button
              key={c.value}
              onClick={() => setCurrentColor(c.value)}
              className={`w-8 h-8 rounded-md border-2 transition ${
                currentColor === c.value
                  ? 'border-white scale-110'
                  : 'border-gray-600 hover:border-gray-400'
              }`}
              style={{ backgroundColor: c.value }}
              title={c.label}
              aria-label={`Select ${c.label}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
