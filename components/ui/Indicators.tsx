"use client";

type IndicatorStatus = "default" | "active" | "success" | "warning" | "error";

type IndicatorItem = {
  id: string | number;
  status?: IndicatorStatus;
};

type IndicatorsProps = {
  items: IndicatorItem[];
  activeIndex: number;
  onSelect?: (index: number) => void;
  variant?: "dots" | "pills" | "numbers" | "progress";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function Indicators({
  items,
  activeIndex,
  onSelect,
  variant = "dots",
  size = "md",
  className = "",
}: IndicatorsProps) {
  const isClickable = !!onSelect;

  // Sizes config
  const sizes = {
    sm: {
      dot: "w-1.5 h-1.5",
      dotActive: "w-5",
      pill: "w-5 h-1.5",
      pillActive: "w-8",
      number: "w-6 h-6 text-xs",
      gap: "gap-1.5",
    },
    md: {
      dot: "w-2 h-2",
      dotActive: "w-6",
      pill: "w-6 h-2",
      pillActive: "w-10",
      number: "w-8 h-8 text-sm",
      gap: "gap-2",
    },
    lg: {
      dot: "w-2.5 h-2.5",
      dotActive: "w-8",
      pill: "w-8 h-2.5",
      pillActive: "w-12",
      number: "w-10 h-10 text-base",
      gap: "gap-2.5",
    },
  };

  // Status colors
  const statusColors: Record<IndicatorStatus, string> = {
    default: "bg-neutral-300",
    active: "bg-blue-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-rose-500",
  };

  // Get color based on status or active state
  const getColor = (index: number, status?: IndicatorStatus) => {
    if (status && status !== "default") {
      return statusColors[status];
    }
    return index === activeIndex ? statusColors.active : statusColors.default;
  };

  // Dots variant
  if (variant === "dots") {
    return (
      <div
        className={`flex items-center justify-center ${sizes[size].gap} ${className}`}
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const color = getColor(index, item.status);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect?.(index)}
              disabled={!isClickable}
              className={`
                rounded-full transition-all duration-300
                ${sizes[size].dot}
                ${isActive ? sizes[size].dotActive : ""}
                ${color}
                ${isClickable ? "cursor-pointer hover:opacity-80" : "cursor-default"}
                disabled:cursor-default
              `}
              aria-label={`Go to item ${index + 1}`}
            />
          );
        })}
      </div>
    );
  }

  // Pills variant
  if (variant === "pills") {
    return (
      <div
        className={`flex items-center justify-center ${sizes[size].gap} ${className}`}
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const color = getColor(index, item.status);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect?.(index)}
              disabled={!isClickable}
              className={`
                rounded-full transition-all duration-300
                ${isActive ? sizes[size].pillActive : sizes[size].pill}
                ${color}
                ${isClickable ? "cursor-pointer hover:opacity-80" : "cursor-default"}
                disabled:cursor-default
              `}
              aria-label={`Go to item ${index + 1}`}
            />
          );
        })}
      </div>
    );
  }

  // Numbers variant
  if (variant === "numbers") {
    return (
      <div
        className={`flex items-center justify-center ${sizes[size].gap} ${className}`}
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const status = item.status || (isActive ? "active" : "default");

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect?.(index)}
              disabled={!isClickable}
              className={`
                rounded-full font-medium transition-all duration-200
                flex items-center justify-center
                ${sizes[size].number}
                ${
                  status === "active"
                    ? "bg-blue-500 text-white shadow-md"
                    : status === "success"
                      ? "bg-emerald-500 text-white"
                      : status === "warning"
                        ? "bg-amber-500 text-white"
                        : status === "error"
                          ? "bg-rose-500 text-white"
                          : "bg-neutral-100 text-neutral-500"
                }
                ${isClickable ? "cursor-pointer hover:scale-110" : "cursor-default"}
                disabled:cursor-default
              `}
              aria-label={`Go to item ${index + 1}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    );
  }

  // Progress variant - connected line
  if (variant === "progress") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;
          const status = item.status;

          const dotColor =
            status === "success"
              ? "bg-emerald-500 border-emerald-500"
              : status === "warning"
                ? "bg-amber-500 border-amber-500"
                : status === "error"
                  ? "bg-rose-500 border-rose-500"
                  : isActive
                    ? "bg-blue-500 border-blue-500"
                    : isPast
                      ? "bg-blue-500 border-blue-500"
                      : "bg-white border-neutral-300";

          const lineColor =
            isPast || status === "success" ? "bg-blue-500" : "bg-neutral-200";

          return (
            <div key={item.id} className="flex items-center">
              {/* Dot */}
              <button
                type="button"
                onClick={() => onSelect?.(index)}
                disabled={!isClickable}
                className={`
                  relative flex items-center justify-center
                  rounded-full border-2 transition-all duration-200
                  ${sizes[size].number}
                  ${dotColor}
                  ${isActive ? "ring-4 ring-blue-100" : ""}
                  ${isClickable ? "cursor-pointer" : "cursor-default"}
                  disabled:cursor-default
                `}
                aria-label={`Go to step ${index + 1}`}
              >
                {status === "success" ? (
                  <CheckIcon className="w-4 h-4 text-white" />
                ) : (
                  <span
                    className={`font-medium ${isPast || isActive ? "text-white" : "text-neutral-500"}`}
                  >
                    {index + 1}
                  </span>
                )}
              </button>

              {/* Connecting Line */}
              {index < items.length - 1 && (
                <div
                  className={`
                    h-0.5 transition-colors duration-300
                    ${size === "sm" ? "w-8" : size === "md" ? "w-12" : "w-16"}
                    ${lineColor}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

// Check icon for progress variant
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
