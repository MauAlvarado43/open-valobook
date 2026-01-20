import { common } from './common';
import { editor } from './editor';
import { toolbar } from './toolbar';
import { homepage } from './homepage';
import { abilities } from './abilities';

export const translations = {
  en: {
    common: common.en,
    editor: editor.en,
    toolbar: toolbar.en,
    homepage: homepage.en,
    abilities: abilities.en,
  },
  es: {
    common: common.es,
    editor: editor.es,
    toolbar: toolbar.es,
    homepage: homepage.es,
    abilities: abilities.es,
  },
};

export type TranslationKeys = typeof translations.en;
export type Language = keyof typeof translations;
