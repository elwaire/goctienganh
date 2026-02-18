export default function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
        ${
          active
            ? "border-primary-500 text-primary-600"
            : "border-transparent text-neutral-500 hover:text-neutral-700"
        }
      `}
    >
      {icon}
      {label}
      <span
        className={`
          text-xs px-2 py-0.5 rounded-full
          ${active ? "bg-primary-100 text-primary-600" : "bg-neutral-100 text-neutral-500"}
        `}
      >
        {count}
      </span>
    </button>
  );
}
