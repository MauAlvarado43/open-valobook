import { useEditorStore } from '@/lib/store/editorStore';
import { translations, TranslationKeys } from '@/translations';

export function useTranslation() {
  const language = useEditorStore((state) => state.language);

  const t = <T extends keyof TranslationKeys>(
    module: T,
    key: keyof TranslationKeys[T],
    params?: Record<string, string | number>
  ): string => {
    let text = (translations[language][module] as any)[key] as string;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replaceAll(`{${k}}`, String(v));
      });
    }

    return text || String(key);
  };

  return { t, language };
}
