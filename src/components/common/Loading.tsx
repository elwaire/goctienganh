import { Loader2 } from "lucide-react";

interface LoadingProps {
  variants?: "default" | "full";
}

export default function Loading({ variants = "default" }: LoadingProps) {
  if (variants === "full") {
    return (
      <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />;
}
