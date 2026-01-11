'use client';

import { MapSelector } from '@/components/Editor/MapSelector';
import { Toolbar } from '@/components/Editor/Toolbar';
import { StrategyCanvas } from '@/components/Editor/StrategyCanvas';

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-700 bg-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold">Strategy Editor</h1>
      </header>
      
      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-80 border-r border-gray-700 bg-gray-800 overflow-y-auto">
          <MapSelector />
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Coming Soon</h3>
            <p className="text-xs text-gray-500">Agent placement, abilities, and more...</p>
          </div>
        </aside>
        
        {/* Main Editor */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <Toolbar />
          
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-6xl mx-auto">
              <StrategyCanvas />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
