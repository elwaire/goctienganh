// components/ui/FormInput.tsx

"use client";

import { useState, forwardRef, type InputHTMLAttributes } from "react";
import { Eye, EyeOff, X, AlertCircle } from "lucide-react";

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  showCount?: boolean;
};

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      value,
      onChange,
      type = "text",
      placeholder,
      error,
      hint,
      disabled = false,
      required = false,
      readOnly = false,
      leftIcon,
      rightIcon,
      clearable = false,
      maxLength,
      showCount = false,
      autoFocus = false,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const handleClear = () => {
      if (onChange) {
        const event = {
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };

    const hasRightElement = rightIcon || clearable || isPassword;

    // Convert value to string to avoid undefined length error
    const inputValue = value?.toString() || "";

    return (
      <div className={className}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            {label}
            {required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div
          className={`
            relative flex items-center
            bg-white border rounded-lg 
            transition-all duration-200
            ${disabled ? "bg-neutral-50 cursor-not-allowed" : ""}
            ${
              isFocused && !error
                ? "border-blue-500"
                : error
                  ? "border-rose-300"
                  : "border-neutral-200 hover:border-neutral-300"
            }
          `}
        >
          {/* Left Icon */}
          {leftIcon && (
            <span className="pl-4 text-neutral-400">{leftIcon}</span>
          )}

          {/* Input */}
          <input
            {...rest}
            ref={ref}
            type={inputType}
            value={value}
            onChange={onChange}
            onFocus={(e) => {
              setIsFocused(true);
              rest.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              rest.onBlur?.(e);
            }}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            autoFocus={autoFocus}
            className={`
              flex-1 h-11 px-4 text-sm text-neutral-800
              bg-transparent outline-none
              placeholder:text-neutral-400
              disabled:cursor-not-allowed disabled:text-neutral-400
              ${leftIcon ? "pl-2" : ""}
              ${hasRightElement ? "pr-2" : ""}
            `}
          />

          {/* Right Elements */}
          <div className="flex items-center gap-1 pr-3">
            {error && !hasRightElement && (
              <AlertCircle className="w-4 h-4 text-rose-500" />
            )}

            {clearable && inputValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}

            {rightIcon && <span className="text-neutral-400">{rightIcon}</span>}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex-1">
            {error ? (
              <p className="text-sm text-rose-500">{error}</p>
            ) : hint ? (
              <p className="text-sm text-neutral-400">{hint}</p>
            ) : null}
          </div>

          {showCount && maxLength && (
            <span
              className={`text-xs ${
                inputValue.length >= maxLength ? "text-rose-500" : "text-neutral-400"
              }`}
            >
              {inputValue.length}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  },
);

FormInput.displayName = "FormInput";

export default FormInput;
