import { ButtonPrimary } from "@/components/ui";
import { Plus } from "lucide-react";

type EmptyStateProps = {
  onClick?: () => void;
  image: string;
  title: string;
  description: string;
  buttonText?: string;
};

export default function EmptyState({
  onClick,
  image,
  title,
  description,
  buttonText,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 flex flex-col items-center ">
      <img src={image} alt="" className="w-32" />
      <h3 className="text-xl font-semibold text-neutral-800 mb-2">{title}</h3>
      <p className="text-neutral-500 mb-6">{description}</p>

      {buttonText && onClick && (
        <ButtonPrimary
          onClick={onClick}
          leftIcon={<Plus className="w-5 h-5" />}
        >
          {buttonText}
        </ButtonPrimary>
      )}
    </div>
  );
}
