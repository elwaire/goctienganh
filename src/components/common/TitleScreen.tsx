interface TitleScreenProps {
  title: string;
  description?: string;
  className?: string;
}

export default function TitleScreen({
  title,
  description,
  className,
}: TitleScreenProps) {
  return (
    <div className={className}>
      <h1 className="text-xl font-bold text-neutral-800">{title}</h1>
      {description && <p className="text-neutral-500">{description}</p>}
    </div>
  );
}
