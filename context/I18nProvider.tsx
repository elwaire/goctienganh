"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Locale, defaultLocale, locales } from "@/i18n/config";
import { translations } from "@/i18n/locales";

const STORAGE_KEY = "learneng_locale";

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

// Helper: Get nested value by path (e.g., "flashcards.main.badge")
function getNestedValue(obj: unknown, path: string): string | undefined {
  const keys = path.split(".");
  let value: unknown = obj;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return typeof value === "string" ? value : undefined;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  // Load saved locale
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && locales.includes(saved)) {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  // Change locale
  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  // Translation function: t("flashcards.main.badge")
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      // Get translation from current locale
      let text = getNestedValue(translations[locale], key);

      // Fallback to English
      if (!text) {
        text = getNestedValue(translations.en, key) || key;
      }

      // Replace {param} with values
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text!.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        });
      }

      return text;
    },
    [locale],
  );

  if (!mounted) return null;

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// Hooks
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}

export function useTranslation() {
  const { t } = useI18n();
  return { t };
}

export function useLocale() {
  const { locale, setLocale } = useI18n();
  return { locale, setLocale };
}
