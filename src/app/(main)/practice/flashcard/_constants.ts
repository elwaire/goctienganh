import type { ShortcutConfig } from "./_types";

export const CARD_FLIP_DELAY_MS = 300;

export const KEY_FEEDBACK_DELAY_MS = 200;

export const SHORTCUT_ITEMS: ShortcutConfig[] = [
  { keys: ["Space", "Enter"], description: "Lật thẻ" },
  { keys: ["1", "X"], description: "Đánh dấu cần ôn" },
  { keys: ["2", "O"], description: "Đánh dấu đã thuộc" },
  { keys: ["←"], description: "Thẻ trước" },
  { keys: ["→"], description: "Thẻ sau" },
  { keys: ["S"], description: "Phát âm" },
  { keys: ["Esc"], description: "Thoát" },
];

export const INTRO_SHORTCUTS: ShortcutConfig[] = [
  { keys: ["Space"], description: "Lật thẻ" },
  { keys: ["1"], description: "Cần ôn" },
  { keys: ["2"], description: "Đã thuộc" },
  { keys: ["S"], description: "Phát âm" },
];
