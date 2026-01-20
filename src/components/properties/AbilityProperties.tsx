import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import type { AbilityPlacement } from '@/types/strategy';
import {
  getAbilityDefinition,
  getMaxDimension,
  isFixedSize,
} from '@/lib/constants/abilityDefinitions';

interface AbilityPropertiesProps {
  elements: AbilityPlacement[];
  onRadiusChange: (radius: number) => void;
  onIntermediatePointsChange: (count: number) => void;
}

export function AbilityProperties({
  elements,
  onRadiusChange,
  onIntermediatePointsChange,
}: AbilityPropertiesProps) {
  const { t } = useTranslation();
  const hasSmokeOrArea = elements.some((el) => el.subType === 'smoke' || el.subType === 'area');
  const hasCurvedWall = elements.some((el) => el.subType === 'curved-wall');

  return (
    <div className="space-y-4 pt-2 border-t border-gray-800">
      {hasSmokeOrArea && (
        <div>
          {(() => {
            const abilityEl = elements.find(
              (el) => el.subType === 'smoke' || el.subType === 'area'
            );
            if (!abilityEl) return null;
            const def = getAbilityDefinition(abilityEl.abilityName || abilityEl.abilityIcon || '');
            const fixed = isFixedSize(def, 'radius');

            return (
              <>
                <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">
                  {t('editor', 'radius')} {fixed ? `(${t('editor', 'fixed')})` : ''}
                </label>
                {!fixed && (
                  <>
                    <div className="flex gap-1 flex-wrap mb-2">
                      {[30, 45, 60, 80, 100, 150].map((r) => (
                        <button
                          key={r}
                          onClick={() => onRadiusChange(r)}
                          className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-[10px] transition-colors"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="range"
                        min="10"
                        max={getMaxDimension(def, 'radius')}
                        step="5"
                        aria-label={t('editor', 'radius')}
                        title={t('editor', 'radius')}
                        value={abilityEl.radius || 60}
                        onChange={(e) => onRadiusChange(parseInt(e.target.value))}
                        className="flex-1 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <input
                        type="number"
                        min="10"
                        max={getMaxDimension(def, 'radius')}
                        aria-label={t('editor', 'radius')}
                        title={t('editor', 'radius')}
                        value={abilityEl.radius || 60}
                        onChange={(e) => onRadiusChange(parseInt(e.target.value))}
                        className="w-12 bg-gray-800 text-white text-[10px] rounded border border-gray-600 px-1 py-0.5 text-center"
                      />
                    </div>
                  </>
                )}
              </>
            );
          })()}
        </div>
      )}

      {hasCurvedWall && (
        <div>
          <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">
            {t('editor', 'points')}
          </label>
          <div className="flex gap-1 flex-wrap">
            {(() => {
              const abilityEl = elements.find((el) => el.subType === 'curved-wall');
              if (!abilityEl) return null;
              const def = getAbilityDefinition(
                abilityEl.abilityName || abilityEl.abilityIcon || ''
              );
              const maxIntermediatePoints = def?.maxIntermediatePoints ?? 10;
              const options = [0, 1, 2, 3, 4, 5, 6, 8, 10].filter(
                (n) => n <= maxIntermediatePoints
              );
              const currentCount = abilityEl.intermediatePoints ?? 0;

              return options.map((num) => (
                <button
                  key={num}
                  onClick={() => onIntermediatePointsChange(num)}
                  className={`px-2 py-1 rounded text-[10px] transition-colors ${
                    currentCount === num
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  {num}
                </button>
              ));
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
