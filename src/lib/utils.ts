/**
 * Get initials from a full name (first 2 letters)
 * @param name - Full name
 * @returns Initials (2 uppercase letters)
 * @example getInitials("John Doe") => "JD"
 * @example getInitials("Alice") => "AL"
 */
export function getInitials(name: string): string {
  if (!name) return "";

  const words = name.trim().split(/\s+/);

  if (words.length >= 2) {
    // Get first letter of first word and first letter of second word
    return (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1 && words[0].length >= 2) {
    // Get first 2 letters of the single word
    return words[0].slice(0, 2).toUpperCase();
  } else if (words.length === 1 && words[0].length === 1) {
    // Single letter name, return it
    return words[0].toUpperCase();
  }

  return "";
}

/**
 * Generate a consistent background color based on string
 * @param str - Input string (name, email, etc.)
 * @returns Hex color code
 */
export function getAvatarColor(str: string): string {
  const colors = [
    "#3699FF", // Blue
    "#8950FC", // Purple
    "#FFA800", // Orange
    "#F64E60", // Red
    "#1BC5BD", // Teal
    "#6993FF", // Light Blue
    "#FFC700", // Yellow
  ];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}
