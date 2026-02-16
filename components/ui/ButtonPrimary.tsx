import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "gray";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonPrimaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const ButtonPrimary = forwardRef<HTMLButtonElement, ButtonPrimaryProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      ...props
    },
    ref,
  ) => {
    const baseStyles = `
      inline-flex items-center cursor-pointer justify-center gap-2
      font-medium rounded-xl
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const variants: Record<ButtonVariant, string> = {
      primary: `
        bg-primary-500 text-white
        hover:bg-primary-600 active:bg-primary-700
        focus:ring-primary-500
        shadow-sm shadow-primary-200
      `,
      secondary: `
        bg-emerald-50 text-emerald-600
        hover:bg-emerald-100 active:bg-emerald-150
        focus:ring-emerald-500
      `,
      outline: `
        border border-neutral-200 text-neutral-700 bg-white
        hover:bg-neutral-50 hover:border-neutral-300 active:bg-neutral-100
        focus:ring-neutral-500
      `,
      ghost: `
        text-neutral-600 bg-transparent
        hover:bg-neutral-100 active:bg-neutral-150
        focus:ring-neutral-500
      `,
      danger: `
        bg-red-200 text-red-600
        hover:bg-red-300 active:bg-red-400
        focus:ring-red-500
      `,
      success: `
        bg-emerald-200 text-emerald-600
        hover:bg-emerald-300 active:bg-emerald-400
        focus:ring-emerald-500
      `,
      gray: `
        bg-gray-100 text-gray-600
        hover:bg-gray-300 active:bg-gray-400
        focus:ring-gray-500
      `,
    };

    const sizes: Record<ButtonSize, string> = {
      sm: "px-3 h-[40px] text-sm",
      md: "px-4 h-[44px] text-sm",
      lg: "px-6 h-[48px] text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  },
);

ButtonPrimary.displayName = "ButtonPrimary";

export default ButtonPrimary;
