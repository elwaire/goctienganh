interface TitleScreenProps {
  title: string;
}

export default function TitleScreen({ title }: TitleScreenProps) {
  return (
    <div>
      <h1 className="text-xl font-bold text-neutral-800">{title}</h1>
    </div>
  );
}
