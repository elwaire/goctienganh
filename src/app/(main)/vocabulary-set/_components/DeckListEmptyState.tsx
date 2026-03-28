import { Search, BookOpen, Globe, Plus } from "lucide-react";

interface DeckListEmptyStateProps {
  searchQuery: string;
  activeTab: string;
  onCreateNew: () => void;
}

export function DeckListEmptyState({
  searchQuery,
  activeTab,
  onCreateNew,
}: DeckListEmptyStateProps) {
  if (searchQuery) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Không tìm thấy bộ từ nào
        </h3>
        <p className="text-gray-600">Thử tìm kiếm với từ khóa khác</p>
      </div>
    );
  }

  if (activeTab === "my-sets") {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Chưa có bộ từ nào
        </h3>
        <p className="text-gray-600 mb-6">
          Tạo bộ từ đầu tiên để bắt đầu học ngay!
        </p>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Tạo bộ từ mới
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Globe className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Chưa có bộ từ công khai
      </h3>
      <p className="text-gray-600">Hãy quay lại sau nhé!</p>
    </div>
  );
}
