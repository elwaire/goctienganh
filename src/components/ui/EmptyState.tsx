import { ButtonPrimary } from "@/components/ui";
import { useTranslation } from "@/context";
import { BookOpen, Plus } from "lucide-react";

type EmptyStateProps = {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
};

export default function EmptyState({
  onClick,
  icon,
  title,
  description,
  buttonText,
}: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-neutral-800 mb-2">{title}</h3>
      <p className="text-neutral-500 mb-6">{description}</p>

      <ButtonPrimary onClick={onClick} leftIcon={<Plus className="w-5 h-5" />}>
        {buttonText}
      </ButtonPrimary>
    </div>
  );
}
