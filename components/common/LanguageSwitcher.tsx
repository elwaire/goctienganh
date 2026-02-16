"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useLocale } from "@/context";
import { localeConfig, locales } from "@/i18n";

type Props = {
  variant?: "full" | "compact";
};

export function LanguageSwitcher({ variant = "full" }: Props) {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = localeConfig[locale];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl transition-colors"
      >
        <span className="text-base">{current.flag}</span>
        {variant === "full" && (
          <span className="text-sm font-medium text-neutral-700">
            {current.name}
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 text-neutral-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-neutral-200 rounded-xl shadow-lg py-1 z-50">
          {locales.map((loc) => {
            const config = localeConfig[loc];
            const isActive = locale === loc;

            return (
              <button
                key={loc}
                onClick={() => {
                  setLocale(loc);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-neutral-50 ${
                  isActive ? "bg-blue-50" : ""
                }`}
              >
                <span>{config.flag}</span>
                <span
                  className={`flex-1 text-sm ${
                    isActive ? "font-medium text-blue-600" : "text-neutral-700"
                  }`}
                >
                  {config.name}
                </span>
                {isActive && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
