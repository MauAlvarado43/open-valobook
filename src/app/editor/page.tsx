'use client';

import { useState } from 'react';
import { MapSelector } from '@/components/MapSelector';
import { Toolbar } from '@/components/Toolbar';
import { StrategyCanvas } from '@/components/StrategyCanvas';
import { AgentSelector } from '@/components/AgentSelector';
import { Map, Users } from 'lucide-react';

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState<'maps' | 'agents'>('maps');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-700 bg-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold">Strategy Editor</h1>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-80 border-r border-gray-700 bg-gray-800 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('maps')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'maps'
                ? 'text-blue-400 bg-blue-600/10 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
            >
              <Map size={14} />
              Maps
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'agents'
                ? 'text-blue-400 bg-blue-600/10 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
            >
              <Users size={14} />
              Agents
            </button>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <div className={`absolute inset-0 transition-transform duration-300 ${activeTab === 'maps' ? 'translate-x-0' : '-translate-x-full'}`}>
              <MapSelector />
            </div>
            <div className={`absolute inset-0 transition-transform duration-300 ${activeTab === 'agents' ? 'translate-x-0' : 'translate-x-full'}`}>
              <AgentSelector />
            </div>
          </div>
        </aside>

        {/* Main Editor */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <Toolbar />

          <div className="flex-1 relative overflow-hidden bg-gray-950 p-4">
            <StrategyCanvas />
          </div>
        </main>
      </div>
    </div>
  );
}
