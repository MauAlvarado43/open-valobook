'use client';

import { useEditorStore } from '@/lib/store/editorStore';
import type { MapName } from '@/types/strategy';

const MAPS: { name: MapName; displayName: string }[] = [
  { name: 'abyss', displayName: 'Abyss' },
  { name: 'ascent', displayName: 'Ascent' },
  { name: 'bind', displayName: 'Bind' },
  { name: 'breeze', displayName: 'Breeze' },
  { name: 'corrode', displayName: 'Corrode' },
  { name: 'fracture', displayName: 'Fracture' },
  { name: 'haven', displayName: 'Haven' },
  { name: 'icebox', displayName: 'Icebox' },
  { name: 'lotus', displayName: 'Lotus' },
  { name: 'pearl', displayName: 'Pearl' },
  { name: 'split', displayName: 'Split' },
  { name: 'sunset', displayName: 'Sunset' },
];

export function MapSelector() {
  const { selectedMap, setSelectedMap } = useEditorStore();
  
  return (
    <div className="p-4 border-b border-gray-700">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Select Map
      </label>
      <select
        value={selectedMap || ''}
        onChange={(e) => setSelectedMap(e.target.value as MapName)}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Select map"
      >
        <option value="">Choose a map...</option>
        {MAPS.map((map) => (
          <option key={map.name} value={map.name}>
            {map.displayName}
          </option>
        ))}
      </select>
    </div>
  );
}
