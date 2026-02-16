import { Locale } from "../config";
import { common } from "./common";
import { flashcards } from "./flashcards";

// Tất cả modules có cả en và vi
const modules = {
  flashcards,
  common,
};

// Build translations cho từng locale (hỗ trợ nested object)
type ModuleKey = keyof typeof modules;

function buildTranslations(locale: Locale) {
  const result: Record<string, unknown> = {};

  (Object.keys(modules) as ModuleKey[]).forEach((key) => {
    result[key] = modules[key][locale];
  });

  return result;
}

export const translations: Record<Locale, Record<string, unknown>> = {
  en: buildTranslations("en"),
  vi: buildTranslations("vi"),
};
