'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEditorStore } from '@/lib/store/editorStore';
import {
  Settings,
  LogOut,
  Plus,
  FolderOpen,
  X,
  Library,
  Trash2,
  Calendar,
  ChevronRight,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { loadProject } = useEditorStore();
  const [showSettings, setShowSettings] = useState(false);
  const [strategies, setStrategies] = useState<import('@/types/strategy').LibraryStrategy[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLibrary = async () => {
    if (typeof window !== 'undefined' && window.electron?.listLibrary) {
      setLoading(true);
      try {
        const list = await window.electron.listLibrary();
        setStrategies(list || []);
      } catch (err) {
        console.error('Failed to list library:', err);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const handleExit = () => {
    if (typeof window !== 'undefined' && window.electron?.quitApp) {
      window.electron.quitApp();
    }
  };

  const handleLoadFile = async () => {
    if (typeof window !== 'undefined' && window.electron?.openFileDialog) {
      const result = await window.electron.openFileDialog();
      if (result && result.content) {
        try {
          const data = JSON.parse(result.content) as import('@/types/strategy').CanvasData;
          loadProject(data);
          router.push('/editor');
        } catch (error) {
          console.error('Failed to parse strategy file:', error);
        }
      }
    }
  };

  const handleLoadLibrary = (strategy: import('@/types/strategy').LibraryStrategy) => {
    loadProject(strategy.data);
    router.push('/editor');
  };

  const handleDelete = async (e: React.MouseEvent, filename: string) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && window.electron?.deleteFromLibrary) {
      const confirmed = confirm(
        `Are you sure you want to delete "${filename.replace('.ovb', '')}"?`
      );
      if (confirmed) {
        await window.electron.deleteFromLibrary(filename);
        fetchLibrary();
      }
    }
  };

  return (
    <main className="flex min-h-screen bg-[#0F1923] text-white p-8 md:p-16 overflow-hidden relative font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#FF4655] opacity-[0.03] skew-x-[-15deg] translate-x-1/2 pointer-events-none" />

      <div className="z-10 flex flex-col md:flex-row gap-16 w-full max-w-7xl mx-auto items-start">
        {/* Left Side: Navigation & Identity */}
        <div className="flex flex-col gap-12 w-full md:w-1/3">
          <header>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-1 bg-[#FF4655]" />
              <span className="text-[#FF4655] font-black tracking-widest text-[10px] uppercase">
                Tactical Strategy Planner
              </span>
            </div>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-[0.8]">
              OPENVALO<span className="text-[#FF4655]">BOOK</span>
            </h1>
          </header>

          <nav className="flex flex-col gap-3">
            <Link
              href="/editor"
              className="group relative flex items-center justify-between p-5 bg-transparent border border-white/10 hover:border-[#FF4655] transition-all duration-300 overflow-hidden"
              title="Start a new strategy from scratch"
            >
              <div className="absolute inset-0 bg-[#FF4655] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
              <div className="flex items-center gap-4 relative z-10">
                <Plus className="text-white group-hover:text-black transition-colors" size={24} />
                <span className="text-2xl font-black uppercase italic text-white group-hover:text-black transition-colors">
                  New Strategy
                </span>
              </div>
              <ChevronRight className="relative z-10 text-white/30 group-hover:text-black/50" />
            </Link>

            <button
              className="group relative flex items-center justify-between p-5 bg-transparent border border-white/10 hover:border-blue-400 transition-all duration-300 overflow-hidden text-left"
              onClick={handleLoadFile}
              title="Load an .ovb file from your computer"
            >
              <div className="absolute inset-0 bg-blue-400 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
              <div className="flex items-center gap-4 relative z-10">
                <FolderOpen
                  className="text-white group-hover:text-black transition-colors"
                  size={24}
                />
                <span className="text-2xl font-black uppercase italic text-white group-hover:text-black transition-colors">
                  Import File
                </span>
              </div>
              <ChevronRight className="relative z-10 text-white/30 group-hover:text-black/50" />
            </button>

            <button
              className="group relative flex items-center justify-between p-5 bg-transparent border border-white/10 hover:border-gray-400 transition-all duration-300 overflow-hidden text-left"
              onClick={() => setShowSettings(true)}
              title="Adjust application settings"
            >
              <div className="absolute inset-0 bg-gray-400 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
              <div className="flex items-center gap-4 relative z-10">
                <Settings
                  className="text-white group-hover:text-black transition-colors"
                  size={24}
                />
                <span className="text-2xl font-black uppercase italic text-white group-hover:text-black transition-colors">
                  Settings
                </span>
              </div>
              <ChevronRight className="relative z-10 text-white/30 group-hover:text-black/50" />
            </button>

            <button
              onClick={handleExit}
              className="group relative flex items-center gap-4 p-5 bg-transparent border border-white/10 hover:border-red-900 transition-all duration-300 overflow-hidden mt-6 text-left"
              title="Close the application"
            >
              <div className="absolute inset-0 bg-red-900 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
              <LogOut
                className="relative z-10 text-white group-hover:text-red-200 transition-colors"
                size={24}
              />
              <span className="relative z-10 text-2xl font-black uppercase italic text-white group-hover:text-red-200 transition-colors">
                Quit Game
              </span>
            </button>
          </nav>

          <footer className="mt-8 text-gray-600 text-[9px] uppercase tracking-widest leading-relaxed">
            <p>© 2024 MauAlvarado43. OpenValoBook isn&apos;t endorsed by Riot Games.</p>
          </footer>
        </div>

        {/* Right Side: Strategy Library */}
        <div className="flex-1 w-full bg-white/[0.02] border border-white/5 p-8 rounded-2xl flex flex-col h-[calc(100vh-128px)] overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Library className="text-[#FF4655]" size={28} />
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">My Library</h2>
            </div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              {strategies.length} Saved Strategies
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-600 font-bold uppercase tracking-widest animate-pulse">
                Synchronizing Data...
              </div>
            ) : strategies.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-600 text-center gap-4">
                <FolderOpen size={48} className="opacity-20" />
                <div>
                  <p className="font-bold uppercase tracking-widest text-sm mb-1">
                    Your library is empty
                  </p>
                  <p className="text-xs opacity-50">
                    Saved strategies will appear here for quick access.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strategies.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => handleLoadLibrary(s)}
                    className="group bg-white/5 border border-white/5 hover:border-[#FF4655]/50 p-5 rounded-xl transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="flex flex-col gap-4 relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-[#FF4655] uppercase tracking-widest mb-1">
                            {s.mapName}
                          </span>
                          <h3 className="text-xl font-black uppercase italic tracking-tighter truncate w-40">
                            {s.name}
                          </h3>
                        </div>
                        <div
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${s.side === 'attack' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}
                        >
                          {s.side}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold">
                          <Calendar size={12} />
                          {new Date(s.updatedAt).toLocaleDateString()}
                        </div>
                        <button
                          onClick={(e) => handleDelete(e, s.id)}
                          className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                          title="Delete from library"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {/* Hover Effect */}
                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={20} className="text-[#FF4655]" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0F1923] border border-white/10 w-full max-w-lg p-8 rounded-2xl relative">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              title="Close settings"
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-black uppercase italic mb-6">Settings</h2>
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                Application settings will be available in the next update.
              </p>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                <span className="font-bold uppercase text-xs">Developer Mode</span>
                <div className="w-10 h-5 bg-gray-600 rounded-full relative">
                  <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-8 py-4 bg-[#FF4655] text-black font-black uppercase italic tracking-widest hover:bg-[#FF4655]/90 transition-colors"
            >
              Apply Changes
            </button>
          </div>
        </div>
      )}

      {/* Decorative large text overlay */}
      <div className="absolute -bottom-20 -right-20 text-[20rem] font-black text-white opacity-[0.02] italic select-none pointer-events-none uppercase leading-[0.8]">
        Tactical
      </div>
    </main>
  );
}
