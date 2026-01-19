import React from 'react';
import Image from 'next/image';
import { Flag, TriangleAlert, Info, Target } from 'lucide-react';
import type { DrawingElement } from '@/types/strategy';

interface GraphicPropertiesProps {
  element: DrawingElement;
  onUpdate: (updates: Partial<DrawingElement>) => void;
}

export function GraphicProperties({ element, onUpdate }: GraphicPropertiesProps) {
  return (
    <div className="space-y-4 pt-2 border-t border-gray-800">
      {element.type === 'icon' && (
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
                  onClick={() => onUpdate({ iconType: type })}
                  className={`py-2 rounded flex flex-col items-center gap-1 transition-colors ${element.iconType === type
                    ? 'bg-blue-600 text-white shadow-inner'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  title={type.charAt(0).toUpperCase() + type.slice(1)}
                >
                  {type === 'spike' ? (
                    <Image src="/assets/icons/spike.png" alt="Spike" width={16} height={16} className="object-contain" />
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

      {element.type === 'image' && (
        <div>
          <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">Custom Image</label>
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              title="Upload file"
              aria-label="Upload custom image file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    onUpdate({ imageUrl: event.target?.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="block w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
            />
            <input
              type="text"
              placeholder="or enter URL..."
              title="Enter URL"
              aria-label="Custom image URL"
              value={element.imageUrl || ''}
              onChange={(e) => onUpdate({ imageUrl: e.target.value })}
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
            title="Width"
            aria-label="Element Width"
            value={element.width || 40}
            onChange={(e) => onUpdate({ width: parseInt(e.target.value) })}
            className="w-full px-2 py-1 bg-gray-800 text-white rounded border border-gray-600 text-xs"
          />
        </div>
        <div>
          <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">Height</label>
          <input
            type="number"
            title="Height"
            aria-label="Element Height"
            value={element.height || 40}
            onChange={(e) => onUpdate({ height: parseInt(e.target.value) })}
            className="w-full px-2 py-1 bg-gray-800 text-white rounded border border-gray-600 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
