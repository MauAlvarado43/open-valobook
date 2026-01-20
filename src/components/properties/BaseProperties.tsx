import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import type { StrategySide } from '@/types/strategy';

interface BasePropertiesProps {
  side: StrategySide | null;
  onSideChange: (side: StrategySide) => void;
  opacity: number | null;
  onOpacityChange: (opacity: number) => void;
}

export function BaseProperties({
  side,
  onSideChange,
  opacity,
  onOpacityChange,
}: BasePropertiesProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {side !== null && (
        <div>
          <label className="text-gray-300 text-xs font-medium mb-2 block">
            {t('editor', 'teamSide')}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onSideChange('attack')}
              title={t('toolbar', 'attack')}
              className={`flex-1 py-1.5 rounded text-xs font-bold transition ${
                side === 'attack'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {t('toolbar', 'attack')}
            </button>
            <button
              onClick={() => onSideChange('defense')}
              title={t('toolbar', 'defense')}
              className={`flex-1 py-1.5 rounded text-xs font-bold transition ${
                side === 'defense'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {t('toolbar', 'defense')}
            </button>
          </div>
        </div>
      )}

      <div>
        <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">
          {t('editor', 'baseOpacity')}{' '}
          {opacity !== null ? `(${Math.round(opacity * 100)}%)` : `(${t('editor', 'mixed')})`}
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            aria-label={t('editor', 'adjustOpacity')}
            value={opacity ?? 1.0}
            onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
            className="flex-1 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <input
            type="number"
            min="0.1"
            max="1.0"
            step="0.05"
            aria-label={t('editor', 'numericOpacity')}
            value={opacity ?? 1.0}
            onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
            className="w-12 bg-gray-800 text-white text-[10px] rounded border border-gray-600 px-1 py-0.5 text-center"
          />
        </div>
      </div>
    </div>
  );
}
