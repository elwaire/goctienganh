import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  hideText?: boolean;
}

export default function Logo({ className, hideText }: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 w-full min-w-0 ${className ?? ""}`}
    >
      <Image
        src="/logo.png"
        alt="Logo Goc Tieng Anh"
        width={40}
        height={40}
        className="w-10 h-10 object-contain shrink-0"
        priority
      />
      {!hideText && (
        <span className="text-lg font-semibold text-primary-500 truncate animate-in fade-in duration-300">
          Goc Hoc Tap
        </span>
      )}
    </Link>
  );
}
