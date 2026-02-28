"use client";

import { useState, forwardRef } from "react";
import { AlertCircle } from "lucide-react";

type FormTextareaProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  rows?: number;
  minRows?: number;
  maxRows?: number;
  autoResize?: boolean;
  maxLength?: number;
  showCount?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
  className?: string;
};

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      label,
      value,
      onChange,
      placeholder,
      error,
      hint,
      disabled = false,
      required = false,
      readOnly = false,
      rows = 3,
      minRows = 2,
      maxRows = 10,
      autoResize = false,
      maxLength,
      showCount = false,
      resize = "none",
      className = "",
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    // Auto resize logic
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const textarea = e.target;
      onChange(textarea.value);

      if (autoResize) {
        // Reset height to calculate new height
        textarea.style.height = "auto";

        // Calculate line height
        const lineHeight =
          parseInt(getComputedStyle(textarea).lineHeight) || 24;
        const minHeight = minRows * lineHeight;
        const maxHeight = maxRows * lineHeight;

        // Set new height within bounds
        const newHeight = Math.min(
          Math.max(textarea.scrollHeight, minHeight),
          maxHeight,
        );
        textarea.style.height = `${newHeight}px`;
      }
    };

    const resizeClass = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    };

    const charCount = value.length;
    const isOverLimit = maxLength ? charCount > maxLength : false;

    return (
      <div className={className}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            {label}
            {required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}

        {/* Textarea Container */}
        <div
          className={`
            relative rounded-lg 
            transition-all duration-200
            ${disabled ? "bg-neutral-50" : "bg-white"}
          
          `}
        >
          <textarea
            ref={ref}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            rows={autoResize ? minRows : rows}
            maxLength={maxLength}
            className={`
              w-full px-4 py-3 text-sm text-neutral-800
              bg-transparent border rounded-xl outline-none
              placeholder:text-neutral-400
              disabled:cursor-not-allowed disabled:text-neutral-400
              transition-colors duration-200
              ${resizeClass[resize]}
              ${
                isFocused && !error
                  ? "border-blue-500"
                  : error
                    ? "border-rose-300"
                    : "border-neutral-200 hover:border-neutral-300"
              }
            `}
          />

          {/* Error Icon */}
          {error && (
            <div className="absolute top-3 right-3">
              <AlertCircle className="w-4 h-4 text-rose-500" />
            </div>
          )}
        </div>

        {/* Bottom Row: Error/Hint & Character Count */}
        <div className="flex items-start justify-between mt-1.5 gap-4">
          {/* Error or Hint */}
          <div className="flex-1">
            {error ? (
              <p className="text-sm text-rose-500">{error}</p>
            ) : hint ? (
              <p className="text-sm text-neutral-400">{hint}</p>
            ) : null}
          </div>

          {/* Character Count */}
          {showCount && (
            <span
              className={`text-xs shrink-0 ${
                isOverLimit
                  ? "text-rose-500 font-medium"
                  : charCount >= (maxLength || 0) * 0.9
                    ? "text-amber-500"
                    : "text-neutral-400"
              }`}
            >
              {charCount}
              {maxLength && `/${maxLength}`}
            </span>
          )}
        </div>
      </div>
    );
  },
);

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;
