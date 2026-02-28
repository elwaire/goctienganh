interface ProgressBarProps {
  progress: number;
  className?: string;
}

export default function ProgressBar({ progress, className }: ProgressBarProps) {
  return (
    <div
      className={`h-1.5 bg-slate-100 rounded-full overflow-hidden ${className}`}
    >
      <div
        className="h-full bg-linear-to-r from-blue-500 to-indigo-500 transition-all duration-500 rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
