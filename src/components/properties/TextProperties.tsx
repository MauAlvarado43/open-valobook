import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface TextPropertiesProps {
  text: string;
  onTextChange: (text: string) => void;
  fontSize: number | null;
  onFontSizeChange: (size: number) => void;
  showTextEdit: boolean;
}

export function TextProperties({
  text,
  onTextChange,
  fontSize,
  onFontSizeChange,
  showTextEdit,
}: TextPropertiesProps) {
  const { t } = useTranslation();
  const fontSizeOptions = [12, 14, 16, 18, 20, 24, 28, 32];

  return (
    <div className="space-y-4">
      {showTextEdit && (
        <div>
          <label className="text-gray-300 text-xs font-medium mb-2 block">
            {t('editor', 'textContent')}
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
            placeholder={t('editor', 'enterText')}
          />
        </div>
      )}

      <div>
        <label className="text-gray-300 text-xs font-medium mb-2 block">
          {t('editor', 'fontSize')} {fontSize ? `(${fontSize}px)` : `(${t('common', 'mixed')})`}
        </label>
        <div className="flex gap-1 flex-wrap">
          {fontSizeOptions.map((size) => (
            <button
              key={size}
              onClick={() => onFontSizeChange(size)}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                fontSize === size
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
