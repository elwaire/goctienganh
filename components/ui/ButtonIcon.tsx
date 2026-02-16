"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

type ButtonIconVariant =
  | "default"
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger";

type ButtonIconSize = "sm" | "md" | "lg" | "xl";

interface ButtonIconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: ButtonIconVariant;
  size?: ButtonIconSize;
  isLoading?: boolean;
  rounded?: boolean;
  active?: boolean;
  badge?: number | boolean;
}

const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(
  (
    {
      icon,
      variant = "default",
      size = "md",
      isLoading = false,
      rounded = false,
      active = false,
      badge,
      disabled,
      className = "",
      ...props
    },
    ref,
  ) => {
    const baseStyles = `
      relative inline-flex items-center justify-center cursor-pointer
      font-medium transition-all duration-200
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-95
    `;

    const variants: Record<ButtonIconVariant, string> = {
      default: `
        bg-white text-neutral-600 border border-neutral-200
        hover:bg-neutral-50 hover:text-neutral-700 hover:border-neutral-300
        focus-visible:ring-neutral-500
        ${active ? "bg-neutral-100 border-neutral-300" : ""}
      `,
      primary: `
        bg-blue-500 text-white
        hover:bg-blue-600
        focus-visible:ring-blue-500
        ${active ? "bg-blue-600" : ""}
      `,
      secondary: `
        bg-neutral-100 text-neutral-700
        hover:bg-neutral-200
        focus-visible:ring-neutral-500
        ${active ? "bg-neutral-200" : ""}
      `,
      ghost: `
        bg-transparent text-neutral-600
        hover:bg-neutral-100 hover:text-neutral-700
        focus-visible:ring-neutral-500
        ${active ? "bg-neutral-100" : ""}
      `,
      outline: `
        bg-transparent text-neutral-600 border border-neutral-200
        hover:bg-neutral-50 hover:border-neutral-300
        focus-visible:ring-neutral-500
        ${active ? "bg-neutral-50 border-neutral-300" : ""}
      `,
      danger: `
        bg-transparent text-neutral-500
        hover:bg-rose-50 hover:text-rose-600
        focus-visible:ring-rose-500
        ${active ? "bg-rose-50 text-rose-600" : ""}
      `,
    };

    const sizes: Record<ButtonIconSize, { button: string; icon: string }> = {
      sm: {
        button: "w-[40px] h-[40px]",
        icon: "[&>svg]:w-[16px] [&>svg]:h-[16px]",
      },
      md: {
        button: "w-[44px] h-[44px]",
        icon: "[&>svg]:w-[20px] [&>svg]:h-[20px]",
      },
      lg: {
        button: "w-[48px] h-[48px]",
        icon: "[&>svg]:w-[24px] [&>svg]:h-[24px]",
      },
      xl: {
        button: "w-[52px] h-[52px]",
        icon: "[&>svg]:w-[28px] [&>svg]:h-[28px]",
      },
    };

    const radiusStyle = rounded ? "rounded-full" : "rounded-xl";

    const showBadge =
      badge === true || (typeof badge === "number" && badge > 0);

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size].button}
          ${sizes[size].icon}
          ${radiusStyle}
          ${className}
        `}
        {...props}
      >
        {/* Loading Spinner */}
        {isLoading ? <Loader2 className="animate-spin" /> : icon}

        {/* Badge */}
        {showBadge && !isLoading && (
          <span
            className={`
              absolute flex items-center justify-center
              bg-rose-500 text-white text-xs font-medium
              rounded-full min-w-[18px] h-[18px] px-1
              -top-1 -right-1 border-2 border-white
            `}
          >
            {typeof badge === "number" ? (badge > 99 ? "99+" : badge) : ""}
          </span>
        )}
      </button>
    );
  },
);

ButtonIcon.displayName = "ButtonIcon";

export default ButtonIcon;
