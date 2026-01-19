import React from 'react';
import type { DrawingElement } from '@/types/strategy';

interface VisionConePropertiesProps {
  element: DrawingElement;
  onRadiusChange: (radius: number) => void;
  onAngleChange: (angle: number) => void;
  onRotationChange: (rotation: number) => void;
}

export function VisionConeProperties({ element, onRadiusChange, onAngleChange, onRotationChange }: VisionConePropertiesProps) {
  return (
    <div className="space-y-4 pt-2 border-t border-gray-800">
      <div>
        <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">Length</label>
        <div className="flex gap-2 items-center">
          <input
            type="range"
            min="50"
            max="500"
            step="5"
            aria-label="Adjust length"
            title="Adjust length"
            value={element.radius || 150}
            onChange={(e) => onRadiusChange(parseInt(e.target.value))}
            className="flex-1 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <input
            type="number"
            min="50"
            max="500"
            step="5"
            aria-label="Numeric length value"
            title="Enter length"
            value={element.radius || 150}
            onChange={(e) => onRadiusChange(parseInt(e.target.value))}
            className="w-12 bg-gray-800 text-white text-[10px] rounded border border-gray-600 px-1 py-0.5 text-center"
          />
        </div>
      </div>
      <div>
        <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">Angle ({element.angle || 90}°)</label>
        <div className="flex gap-2 items-center">
          <input
            type="range"
            min="10"
            max="360"
            step="5"
            aria-label="Adjust angle"
            title="Adjust angle"
            value={element.angle || 90}
            onChange={(e) => onAngleChange(parseInt(e.target.value))}
            className="flex-1 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <input
            type="number"
            min="10"
            max="360"
            step="5"
            aria-label="Numeric angle value"
            title="Enter angle"
            value={element.angle || 90}
            onChange={(e) => onAngleChange(parseInt(e.target.value))}
            className="w-12 bg-gray-800 text-white text-[10px] rounded border border-gray-600 px-1 py-0.5 text-center"
          />
        </div>
      </div>
      <div>
        <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">Direction ({element.rotation || 0}°)</label>
        <div className="flex gap-2 items-center">
          <input
            type="range"
            min="0"
            max="360"
            step="5"
            aria-label="Adjust direction"
            title="Adjust direction"
            value={element.rotation || 0}
            onChange={(e) => onRotationChange(parseInt(e.target.value))}
            className="flex-1 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <input
            type="number"
            min="0"
            max="360"
            step="5"
            aria-label="Numeric direction value"
            title="Enter direction"
            value={element.rotation || 0}
            onChange={(e) => onRotationChange(parseInt(e.target.value))}
            className="w-12 bg-gray-800 text-white text-[10px] rounded border border-gray-600 px-1 py-0.5 text-center"
          />
        </div>
      </div>
    </div>
  );
}
