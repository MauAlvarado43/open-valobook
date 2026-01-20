'use client';

import { useEditorStore } from '@/lib/store/editorStore';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useEditorStore();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-gray-400 mb-1">
        <Globe size={14} />
        <span className="text-[10px] font-black uppercase tracking-widest">Select Language</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setLanguage('en')}
          className={`flex-1 py-2 px-4 text-[10px] font-black uppercase tracking-widest transition-all border ${
            language === 'en'
              ? 'bg-[#FF4655] text-black border-[#FF4655]'
              : 'bg-white/5 text-white border-white/10 hover:border-white/20'
          }`}
        >
          English
        </button>
        <button
          onClick={() => setLanguage('es')}
          className={`flex-1 py-2 px-4 text-[10px] font-black uppercase tracking-widest transition-all border ${
            language === 'es'
              ? 'bg-[#FF4655] text-black border-[#FF4655]'
              : 'bg-white/5 text-white border-white/10 hover:border-white/20'
          }`}
        >
          Español
        </button>
      </div>
    </div>
  );
}
