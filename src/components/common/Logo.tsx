interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <div className="flex items-center gap-1 w-full">
      <img
        src="https://i.pinimg.com/736x/30/db/d7/30dbd7182ca6beaec42f11c97106efa9.jpg"
        alt="Logo"
        className="w-10 h-10 rounded-lg"
      />
      <span className="text-lg font-semibold text-primary-500">Gochoctap</span>
    </div>
  );
}
