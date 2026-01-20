import { Library } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface ToolbarBrandingProps {
  strategyName: string;
  setStrategyName: (name: string) => void;
  onSaveToLibrary: () => void;
  bgModule: string;
  hClassTop: string;
}

export function ToolbarBranding({
  strategyName,
  setStrategyName,
  onSaveToLibrary,
  bgModule,
  hClassTop,
}: ToolbarBrandingProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex items-center rounded-lg overflow-hidden group focus-within:ring-1 focus-within:ring-[#FF4655]/50 ${bgModule} ${hClassTop} w-full sm:w-auto`}
    >
      <div className="px-3 flex flex-col justify-center flex-1 sm:min-w-[200px]">
        <span className="text-[6px] font-black text-white/30 uppercase tracking-[0.2em] leading-none mb-0.5">
          {t('editor', 'properties')}
        </span>
        <input
          type="text"
          value={strategyName}
          onChange={(e) => setStrategyName(e.target.value)}
          className="bg-transparent text-[10px] font-black uppercase italic border-none p-0 focus:ring-0 w-full placeholder:text-white/10 text-white"
          placeholder={t('homepage', 'untitledStrategy')}
          title={t('editor', 'properties')}
        />
      </div>
      <button
        onClick={onSaveToLibrary}
        className="h-full px-4 bg-[#FF4655] text-white hover:bg-[#FF4655]/90 active:scale-95 transition-all flex items-center justify-center shrink-0"
        title={`${t('toolbar', 'saveToLibrary')} [S]`}
      >
        <Library size={14} />
      </button>
    </div>
  );
}
