import { Swords, Shield } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import type { StrategySide } from '@/types/strategy';

interface TacticalSwitcherProps {
  strategySide: StrategySide;
  setStrategySide: (side: StrategySide) => void;
  clearSelection: () => void;
  bgModule: string;
  hClassBottom: string;
}

export function TacticalSwitcher({
  strategySide,
  setStrategySide,
  clearSelection,
  bgModule,
  hClassBottom,
}: TacticalSwitcherProps) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-start overflow-hidden">
      <div className={`flex p-1 gap-1 rounded-lg ${hClassBottom} ${bgModule} shrink-0`}>
        <button
          onClick={() => {
            clearSelection();
            setStrategySide('attack');
          }}
          className={`px-3 2xl:px-6 rounded text-[10px] font-black uppercase italic flex items-center justify-center gap-2.5 transition-all shrink-0 ${
            strategySide === 'attack'
              ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/30'
              : 'text-white/30 hover:text-white/70 hover:bg-white/5'
          }`}
        >
          <Swords size={16} />
          <span className="hidden 2xl:inline">{t('toolbar', 'attack')}</span>
        </button>
        <button
          onClick={() => {
            clearSelection();
            setStrategySide('defense');
          }}
          className={`px-3 2xl:px-6 rounded text-[10px] font-black uppercase italic flex items-center justify-center gap-2.5 transition-all shrink-0 ${
            strategySide === 'defense'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'text-white/30 hover:text-white/70 hover:bg-white/5'
          }`}
        >
          <Shield size={16} />
          <span className="hidden 2xl:inline">{t('toolbar', 'defense')}</span>
        </button>
      </div>
    </div>
  );
}
