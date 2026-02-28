import { forwardRef } from "react";
import { X } from "lucide-react";

type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline";

type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  dotColor?: string;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  rounded?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = "default",
      size = "md",
      dot = false,
      dotColor,
      icon,
      removable = false,
      onRemove,
      rounded = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-1.5
      font-medium transition-colors whitespace-nowrap
    `;

    const variants: Record<BadgeVariant, string> = {
      default: "bg-neutral-100 text-neutral-700",
      primary: "bg-blue-100 text-blue-700",
      secondary: "bg-neutral-200 text-neutral-800",
      success: "bg-emerald-100 text-emerald-700",
      warning: "bg-amber-100 text-amber-700",
      danger: "bg-rose-100 text-rose-700",
      info: "bg-sky-100 text-sky-700",
      outline: "bg-transparent border border-neutral-300 text-neutral-600",
    };

    const sizes: Record<BadgeSize, string> = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-1 text-xs",
      lg: "px-3 py-1.5 text-sm",
    };

    const dotColors: Record<BadgeVariant, string> = {
      default: "bg-neutral-500",
      primary: "bg-blue-500",
      secondary: "bg-neutral-600",
      success: "bg-emerald-500",
      warning: "bg-amber-500",
      danger: "bg-rose-500",
      info: "bg-sky-500",
      outline: "bg-neutral-500",
    };

    const radiusStyle = rounded ? "rounded-full" : "rounded-md";

    return (
      <span
        ref={ref}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${radiusStyle}
          ${className}
        `}
        {...props}
      >
        {dot && (
          <span
            className={`w-1.5 h-1.5 rounded-full ${dotColor || dotColors[variant]}`}
          />
        )}
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="shrink-0 -mr-1 ml-0.5 p-0.5 rounded hover:bg-black/10 transition-colors"
            aria-label="Remove"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export default Badge;
