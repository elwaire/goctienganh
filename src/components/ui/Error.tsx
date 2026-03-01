import { AlertCircle } from "lucide-react";

interface ErrorProps {
  message?: string;
}

export default function Error({ message }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <AlertCircle className="w-10 h-10 text-rose-400" />
      <p className="text-sm text-neutral-500">{message}</p>
    </div>
  );
}
