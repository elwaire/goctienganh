"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

type Option = {
  value: string;
  label: string;
};

type FormSelectProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly Option[] | Option[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

export default function FormSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select...",
  error,
  disabled = false,
  required = false,
  className = "",
}: FormSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative cursor-pointer ${className}`} ref={ref}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Select Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          relative w-full h-11 px-4 text-left
          bg-white border rounded-lg
          flex items-center justify-between gap-2
          transition-all duration-200
          ${
            disabled
              ? "bg-neutral-50 cursor-not-allowed opacity-60"
              : "cursor-pointer hover:border-neutral-300"
          }
          ${
            isOpen
              ? "border-blue-500 "
              : error
                ? "border-rose-300"
                : "border-neutral-200"
          }
        `}
      >
        <span
          className={`text-sm truncate ${
            selectedOption ? "text-neutral-800" : "text-neutral-400"
          }`}
        >
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="
            absolute z-50 mt-2 w-full
            bg-white border border-neutral-200 rounded-lg
            shadow-lg shadow-neutral-200/50
             max-h-60 overflow-auto
            animate-in fade-in-0 zoom-in-95 duration-150
          "
          style={{ minWidth: ref.current?.offsetWidth }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`
                  w-full flex cursor-pointer items-center gap-3 px-4 py-2.5 text-left
                  transition-colors duration-150
                  ${
                    isSelected
                      ? "bg-blue-50 text-blue-600"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }
                `}
              >
                <span className="flex-1 text-sm">{opt.label}</span>
                {isSelected && (
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Error Message */}
      {error && <p className="mt-1.5 text-sm text-rose-500">{error}</p>}
    </div>
  );
}
