import type { TranslationDictionary } from "@novacore/frontend-foundation";

/** Recursively flattens a nested TranslationDictionary into dot-path string keys. */
export function flattenDictionary(
  dict: TranslationDictionary,
  prefix = "",
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(dict)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      result[fullKey] = value;
    } else {
      Object.assign(result, flattenDictionary(value, fullKey));
    }
  }
  return result;
}
