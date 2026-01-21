'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEditorStore } from '@/lib/store/editorStore';
import { ConfirmModal } from '@/components/ConfirmModal';
import {
  LogOut,
  Plus,
  FolderOpen,
  X,
  Library,
  Trash2,
  Calendar,
  ChevronRight,
  Search,
  Settings,
} from 'lucide-react';
import packageJson from '../../package.json';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSwitcher } from '@/components/settings/LanguageSwitcher';

export default function HomePage() {
  const router = useRouter();
  const {
    loadProject,
    resetProject,
    setConfirmModal,
    language,
    autoSave,
    setAutoSave,
    storagePath,
    setStoragePath,
  } = useEditorStore();
  const [showSettings, setShowSettings] = useState(false);
  const [strategies, setStrategies] = useState<import('@/types/strategy').LibraryStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapMetadata, setMapMetadata] = useState<Record<string, string>>({});
  const [searchLibrary, setSearchLibrary] = useState('');

  useEffect(() => {
    fetch('/assets/maps-metadata.json')
      .then((res) => res.json())
      .then((data: any[]) => {
        const meta: Record<string, string> = {};
        data.forEach((m) => {
          meta[m.name.toLowerCase()] = m.splash;
        });
        setMapMetadata(meta);
      })
      .catch((err) => console.error('Failed to load map metadata:', err));
  }, []);

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

  const handleSelectStorage = async () => {
    if (typeof window !== 'undefined' && window.electron?.selectDirectory) {
      const path = await window.electron.selectDirectory();
      if (path) {
        setStoragePath(path);
      }
    }
  };

  const handleResetStorage = () => {
    setStoragePath(null);
  };

  const { t } = useTranslation();

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

  const handleDelete = async (e: React.MouseEvent, filename: string, strategyName: string) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && window.electron?.deleteFromLibrary) {
      setConfirmModal({
        title: t('homepage', 'deleteStrategyTitle'),
        message: t('homepage', 'deleteStrategyMsg', { name: strategyName }),
        onConfirm: async () => {
          await window.electron.deleteFromLibrary(filename);
          fetchLibrary();
        },
      });
    }
  };

  return (
    <main className="flex min-h-screen bg-[#0F1923] text-white p-6 md:p-12 lg:p-16 overflow-hidden relative font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#FF4655] opacity-[0.03] skew-x-[-15deg] translate-x-1/2 pointer-events-none" />

      <div className="z-10 flex flex-col md:flex-row gap-10 md:gap-16 lg:gap-24 w-full max-w-7xl mx-auto items-start">
        {/* Left Side: Navigation & Identity */}
        <div className="flex flex-col gap-6 md:gap-10 w-full md:w-[280px] lg:w-[340px] shrink-0">
          <header>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-1 bg-[#FF4655]" />
              <span className="text-[#FF4655] font-black tracking-widest text-[10px] uppercase">
                {t('homepage', 'subtitle')}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black italic uppercase tracking-tighter leading-[0.8] mb-1">
              OPENVALO<span className="text-[#FF4655]">BOOK</span>
            </h1>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">
              v{packageJson.version}
            </div>
          </header>

          <nav className="flex flex-col gap-3">
            <Link
              href="/editor"
              onClick={() => resetProject()}
              className="group relative flex items-center justify-between p-3 sm:p-4 bg-transparent border border-white/10 hover:border-[#FF4655] transition-all duration-300 overflow-hidden"
              title={t('homepage', 'newStrategyDesc')}
            >
              <div className="absolute inset-0 bg-[#FF4655] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
              <div className="flex items-center gap-3 relative z-10">
                <Plus className="text-white group-hover:text-black transition-colors" size={20} />
                <span className="text-base sm:text-lg lg:text-xl font-black uppercase italic text-white group-hover:text-black transition-colors whitespace-nowrap">
                  {t('homepage', 'newStrategy')}
                </span>
              </div>
              <ChevronRight
                className="relative z-10 text-white/30 group-hover:text-black/50"
                size={16}
              />
            </Link>

            <button
              className="group relative flex items-center justify-between p-3 sm:p-4 bg-transparent border border-white/10 hover:border-blue-400 transition-all duration-300 overflow-hidden text-left"
              onClick={handleLoadFile}
              title={t('homepage', 'importFileDesc')}
            >
              <div className="absolute inset-0 bg-blue-400 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
              <div className="flex items-center gap-3 relative z-10">
                <FolderOpen
                  className="text-white group-hover:text-black transition-colors"
                  size={20}
                />
                <span className="text-base sm:text-lg lg:text-xl font-black uppercase italic text-white group-hover:text-black transition-colors whitespace-nowrap">
                  {t('homepage', 'importFile')}
                </span>
              </div>
              <ChevronRight
                className="relative z-10 text-white/30 group-hover:text-black/50"
                size={16}
              />
            </button>

            <button
              className="group relative flex items-center justify-between p-3 sm:p-4 bg-transparent border border-white/10 hover:border-gray-400 transition-all duration-300 overflow-hidden text-left"
              onClick={() => setShowSettings(true)}
              title={t('homepage', 'settingsDesc')}
            >
              <div className="absolute inset-0 bg-gray-400 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
              <div className="flex items-center gap-3 relative z-10">
                <Settings
                  className="text-white group-hover:text-black transition-colors"
                  size={20}
                />
                <span className="text-base sm:text-lg lg:text-xl font-black uppercase italic text-white group-hover:text-black transition-colors whitespace-nowrap">
                  {t('homepage', 'settings')}
                </span>
              </div>
              <ChevronRight
                className="relative z-10 text-white/30 group-hover:text-black/50"
                size={16}
              />
            </button>

            <button
              onClick={handleExit}
              className="group relative flex items-center gap-3 p-3 sm:p-4 bg-transparent border border-white/10 hover:border-red-900 transition-all duration-300 overflow-hidden mt-2 text-left"
              title={t('homepage', 'quitDesc')}
            >
              <div className="absolute inset-0 bg-red-900 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
              <LogOut
                className="relative z-10 text-white group-hover:text-red-200 transition-colors"
                size={20}
              />
              <span className="relative z-10 text-base sm:text-lg lg:text-xl font-black uppercase italic text-white group-hover:text-red-200 transition-colors whitespace-nowrap">
                {t('homepage', 'quit')}
              </span>
            </button>
          </nav>

          <footer className="mt-8 text-gray-600 text-[9px] uppercase tracking-widest leading-relaxed">
            <p>{t('homepage', 'disclaimer')}</p>
          </footer>
        </div>

        {/* Right Side: Strategy Library */}
        <div className="flex-1 w-full bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col h-auto md:h-[calc(100vh-128px)] overflow-hidden md:min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#FF4655]/10 rounded-lg">
                <Library className="text-[#FF4655]" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black italic uppercase tracking-tighter leading-none">
                  {t('homepage', 'myLibrary')}
                </h2>
                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">
                  {t('homepage', 'savedStrategies', { count: strategies.length })}
                </div>
              </div>
            </div>

            <div className="relative group w-full lg:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search
                  className="text-white/20 group-focus-within:text-[#FF4655] transition-colors"
                  size={14}
                />
              </div>
              <input
                type="text"
                placeholder={t('homepage', 'searchPlaceholder')}
                value={searchLibrary}
                onChange={(e) => setSearchLibrary(e.target.value)}
                className="block w-full bg-white/[0.03] border border-white/10 rounded-sm py-2 pl-10 pr-4 text-white text-[10px] font-black uppercase tracking-widest placeholder:text-white/10 focus:outline-none focus:border-[#FF4655]/50 focus:bg-white/[0.05] transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-600 font-bold uppercase tracking-widest animate-pulse">
                {t('homepage', 'synchronizing')}
              </div>
            ) : strategies.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-600 text-center gap-4">
                <FolderOpen size={48} className="opacity-20" />
                <div>
                  <p className="font-bold uppercase tracking-widest text-sm mb-1">
                    {t('homepage', 'emptyLibrary')}
                  </p>
                  <p className="text-xs opacity-50">{t('homepage', 'emptyLibrarySub')}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strategies
                  .filter((s) => {
                    const name = (s.data?.name || s.name || '').toLowerCase();
                    const map = (s.mapName || '').toLowerCase();
                    const query = searchLibrary.toLowerCase();
                    return name.includes(query) || map.includes(query);
                  })
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .map((s) => {
                    const splashPath = mapMetadata[s.mapName?.toLowerCase() || ''] || '';
                    return (
                      <div
                        key={s.id}
                        onClick={() => handleLoadLibrary(s)}
                        className="group bg-[#0F1923] border border-white/10 hover:border-[#FF4655]/50 rounded-xl transition-all cursor-pointer relative overflow-hidden h-40 shadow-2xl"
                      >
                        {/* Background Map Splash */}
                        {splashPath && (
                          <div className="absolute inset-0 z-0">
                            <Image
                              src={`/assets/${splashPath}`}
                              alt={s.mapName || 'Map Splash'}
                              fill
                              className="object-cover opacity-30 group-hover:scale-110 transition-transform duration-700 brightness-50"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1923] via-[#0F1923]/60 to-transparent" />
                          </div>
                        )}

                        <div className="flex flex-col h-full p-5 relative z-10 justify-between">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-[10px] font-black text-[#FF4655] uppercase tracking-[0.2em] drop-shadow-lg">
                                {s.mapName}
                              </span>
                              <div
                                className={`px-2 py-0.5 rounded-sm text-[8px] font-black uppercase italic tracking-widest leading-none ${
                                  s.side === 'attack'
                                    ? 'bg-[#FF4655] text-white'
                                    : 'bg-blue-600 text-white'
                                }`}
                              >
                                {t('toolbar', s.side as any)}
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <h3 className="text-2xl font-black uppercase italic tracking-tighter drop-shadow-xl text-white truncate flex-1 min-w-0 pr-4">
                                {s.data?.name || s.name || t('homepage', 'untitledStrategy')}
                              </h3>
                              <div className="text-[#FF4655] opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 shrink-0">
                                <ChevronRight size={24} />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold">
                              <Calendar size={12} className="text-[#FF4655]" />
                              {new Date(s.updatedAt).toLocaleDateString(
                                language === 'es' ? 'es-ES' : 'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                }
                              )}
                            </div>
                            <button
                              onClick={(e) => handleDelete(e, s.id, s.name)}
                              className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                              title={t('homepage', 'deleteFromLibrary')}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
              title={t('common', 'cancel')}
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-black uppercase italic mb-6">{t('common', 'settings')}</h2>
            <div className="space-y-6">
              <LanguageSwitcher />

              {/* Auto-save Toggle */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold uppercase text-xs mb-1">{t('common', 'autoSave')}</h3>
                    <p className="text-[10px] text-gray-500">{t('common', 'autoSaveDesc')}</p>
                  </div>
                  <button
                    type="button"
                    title={t('common', 'autoSave')}
                    onClick={() => setAutoSave(!autoSave)}
                    className={`shrink-0 w-12 h-6 rounded-full relative transition-colors ${
                      autoSave ? 'bg-[#FF4655]' : 'bg-gray-700'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                        autoSave ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Storage Location */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="font-bold uppercase text-xs mb-3">
                  {t('common', 'storageLocation')}
                </h3>
                <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                  <div className="flex flex-col gap-1 mb-4">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                      {t('common', 'currentPath')}
                    </span>
                    <span className="text-[11px] font-mono text-gray-300 break-all bg-black/40 p-2 rounded border border-white/5">
                      {storagePath || t('common', 'pathNotSet')}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSelectStorage}
                      className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase italic tracking-widest transition-colors"
                    >
                      {t('common', 'changePath')}
                    </button>
                    {storagePath && (
                      <button
                        onClick={handleResetStorage}
                        className="px-4 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-500 text-[10px] font-black uppercase italic tracking-widest transition-colors"
                      >
                        {t('common', 'resetPath')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-8 py-4 bg-[#FF4655] text-black font-black uppercase italic tracking-widest hover:bg-[#FF4655]/90 transition-colors"
              title={t('common', 'applyChanges')}
            >
              {t('common', 'applyChanges')}
            </button>
          </div>
        </div>
      )}

      {/* Decorative large text overlay */}
      <div className="absolute -bottom-10 -right-10 text-[10rem] md:text-[15rem] lg:text-[20rem] font-black text-white opacity-[0.02] italic select-none pointer-events-none uppercase leading-[0.8] overflow-hidden">
        Tactical
      </div>
      <ConfirmModal />
    </main>
  );
}
