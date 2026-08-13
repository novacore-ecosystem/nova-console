import {
  SUPPORTED_LOCALES,
  TRANSLATION_RESOURCES,
  type Locale,
} from "@novacore/frontend-foundation";

import { flattenDictionary } from "@/shared/i18n";
import { APP_DICTIONARY } from "@/shared/i18n/dictionary";

export interface TranslationCatalogEntry {
  key: string;
  baseValue: string;
}

export const TRANSLATION_LOCALES = SUPPORTED_LOCALES;

/** Every known key for a locale, from the same two real dictionaries the app translator resolves against. */
export function getTranslationCatalog(locale: Locale): TranslationCatalogEntry[] {
  const fallbackFlat = flattenDictionary(TRANSLATION_RESOURCES[locale] ?? TRANSLATION_RESOURCES.en);
  const appFlat = flattenDictionary(APP_DICTIONARY[locale] ?? {});
  const merged = { ...fallbackFlat, ...appFlat };

  return Object.entries(merged)
    .map(([key, baseValue]) => ({ key, baseValue }))
    .sort((a, b) => a.key.localeCompare(b.key));
}
