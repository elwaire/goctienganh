// components/ui/DynamicIcon.tsx

"use client";

import { icons, type LucideProps } from "lucide-react";

type DynamicIconProps = LucideProps & {
  /** Icon name — supports PascalCase ("BookOpen"), kebab-case ("book-open"), or snake_case ("book_open") */
  name: string;
  /** Fallback icon name if the given name is not found */
  fallback?: string;
};

/**
 * Convert kebab-case or snake_case to PascalCase.
 * "book-open" → "BookOpen", "arrow_left" → "ArrowLeft", "Home" → "Home"
 */
function toPascalCase(str: string): string {
  return str
    .replace(/[-_]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (_, char) => char.toUpperCase());
}

export default function DynamicIcon({
  name,
  fallback = "CircleDashed",
  ...props
}: DynamicIconProps) {
  const pascalName = toPascalCase(name);
  const IconComponent =
    icons[pascalName as keyof typeof icons] ??
    icons[fallback as keyof typeof icons];

  if (!IconComponent) return null;

  return <IconComponent {...props} />;
}
