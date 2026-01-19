'use client';

import { useState, useEffect } from 'react';
import { useEditorStore } from '@/lib/store/editorStore';
import type { MapName } from '@/types/strategy';
import Image from 'next/image';
import { Search } from 'lucide-react';

interface MapMetadata {
  id: string;
  name: string;
  splash: string;
}

export function MapSelector() {
  const { selectedMap, setSelectedMap, clearSelection } = useEditorStore();
  const [maps, setMaps] = useState<MapMetadata[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/assets/maps-metadata.json')
      .then((res) => res.json())
      .then((data: MapMetadata[]) => {
        const competitiveMaps = [
          'Abyss', 'Ascent', 'Bind', 'Breeze', 'Corrode', 'Fracture',
          'Haven', 'Icebox', 'Lotus', 'Pearl', 'Split', 'Sunset'
        ];

        const filtered = data.filter(map => competitiveMaps.includes(map.name));
        const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name));
        setMaps(sorted);
      })
      .catch((err) => console.error('Failed to load maps', err));
  }, []);

  const filteredMaps = maps.filter((map) =>
    map.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="p-4 border-b border-gray-700 bg-gray-900/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input
            type="text"
            placeholder="Search maps..."
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-1.5 pl-9 pr-4 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2.5 custom-scrollbar">
        <div className="grid grid-cols-1 gap-2.5">
          {filteredMaps.map((map) => {
            const mapKey = map.name.toLowerCase().replace(' ', '-') as MapName;
            const isSelected = selectedMap === mapKey;

            return (
              <button
                key={map.id}
                onClick={() => {
                  clearSelection();
                  setSelectedMap(mapKey);
                }}
                className={`group relative h-20 rounded-lg overflow-hidden border-2 transition-all ${isSelected
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-transparent hover:border-gray-500'
                  }`}
              >
                <Image
                  src={`/assets/${map.splash}`}
                  alt={map.name}
                  fill
                  sizes="300px"
                  className={`object-cover transition-transform duration-500 ${isSelected ? 'scale-110' : 'group-hover:scale-110'
                    }`}
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity ${isSelected ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
                  }`} />
                <div className="absolute bottom-2 left-3">
                  <span className={`text-xs font-bold transition-colors ${isSelected ? 'text-blue-400' : 'text-white'
                    }`}>
                    {map.name}
                  </span>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-0.5 shadow-lg">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {filteredMaps.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-xs italic">
            No maps found matching &quot;{search}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
