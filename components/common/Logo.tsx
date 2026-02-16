interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <div className="flex items-center gap-2 w-full">
      <img
        src="https://i.pinimg.com/736x/93/84/72/938472184c8ab514b40d811f413593d8.jpg"
        alt="Logo"
        className="w-10 h-10 rounded-lg"
      />
      <span className="text-xl font-semibold text-primary-500">
        Goctienganh
      </span>
    </div>
  );
}
