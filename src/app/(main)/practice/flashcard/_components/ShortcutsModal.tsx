import { X, Keyboard, Info } from "lucide-react";
import { SHORTCUT_ITEMS } from "../_constants";

interface ShortcutsModalProps {
  onClose: () => void;
}

export function ShortcutsModal({ onClose }: ShortcutsModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Phím tắt</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-3">
          {SHORTCUT_ITEMS.map((item) => (
            <ShortcutRow
              key={item.description}
              keys={item.keys}
              description={item.description}
            />
          ))}
        </div>

        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              Sử dụng phím tắt giúp bạn học nhanh hơn và không cần dùng chuột!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShortcutRow({
  keys,
  description,
}: {
  keys: string[];
  description: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-700">{description}</span>
      <div className="flex items-center gap-2">
        {keys.map((key, index) => (
          <span key={index} className="flex items-center gap-1">
            {index > 0 && (
              <span className="text-gray-400 text-sm">hoặc</span>
            )}
            <kbd className="px-2.5 py-1.5 bg-gray-100 border border-gray-300 rounded text-sm font-mono text-gray-700 min-w-[2.5rem] text-center">
              {key}
            </kbd>
          </span>
        ))}
      </div>
    </div>
  );
}
