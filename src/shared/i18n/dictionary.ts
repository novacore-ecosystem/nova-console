import type { TranslationDictionary } from "@novacore/frontend-foundation";

/**
 * nova-console's own application dictionary, layered above frontend-foundation's
 * TRANSLATION_RESOURCES fallback. Namespaced per feature as features are added
 * (see rules/localization.md). Values here take priority over the fallback bundle.
 */
export const APP_DICTIONARY: Record<string, TranslationDictionary> = {
  en: {
    app: {
      name: "Nova Console",
      description: "NovaCore's central administration console",
    },
  },
  vi: {
    app: {
      name: "Nova Console",
      description: "Trung tâm quản trị của NovaCore",
    },
  },
  "zh-CN": {
    app: {
      name: "Nova Console",
      description: "NovaCore 中央管理控制台",
    },
  },
};
