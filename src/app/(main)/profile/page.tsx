"use client";

import { useState } from "react";
import {
  User,
  Lock,
  Camera,
  Check,
  TrendingUp,
  Target,
  Award,
  Flame,
  Clock,
  Book,
  Star,
  Bell,
  X,
  Info,
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<
    "info" | "security" | "progress" | "goals"
  >("info");
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  const [form, setForm] = useState({
    fullname: "Võ Ngọc Min",
    email: "elwairestudio@gmail.com",
    phone: "0985940157",
    dob: "2026-02-28",
  });

  const [goals, setGoals] = useState({
    dailyWords: 20,
    dailyTime: 30,
    notifications: true,
    reminderTime: "19:00",
  });

  const presetAvatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
  ];

  const stats = {
    wordsLearned: 1245,
    streak: 15,
    level: "Intermediate (B1)",
    lessonsCompleted: 32,
    totalLessons: 50,
    studyTimeWeek: "3h 24m",
    accuracy: 87,
  };

  const badges = [
    { id: 1, name: "100 Days Streak", icon: "🔥", earned: true },
    { id: 2, name: "Word Master", icon: "📚", earned: true },
    { id: 3, name: "Perfect Week", icon: "⭐", earned: true },
    { id: 4, name: "Early Bird", icon: "🌅", earned: false },
    { id: 5, name: "Night Owl", icon: "🦉", earned: false },
  ];

  const earnedBadges = badges.filter((b) => b.earned);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <TabButton
              active={activeTab === "info"}
              onClick={() => setActiveTab("info")}
              icon={<User className="w-4 h-4" />}
            >
              Thông tin
            </TabButton>

            <TabButton
              active={activeTab === "progress"}
              onClick={() => setActiveTab("progress")}
              icon={<TrendingUp className="w-4 h-4" />}
            >
              Tiến độ
            </TabButton>

            <TabButton
              active={activeTab === "goals"}
              onClick={() => setActiveTab("goals")}
              icon={<Target className="w-4 h-4" />}
            >
              Mục tiêu
            </TabButton>

            <TabButton
              active={activeTab === "security"}
              onClick={() => setActiveTab("security")}
              icon={<Lock className="w-4 h-4" />}
            >
              Bảo mật
            </TabButton>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* TAB 1: THÔNG TIN CÁ NHÂN */}
            {activeTab === "info" && (
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Tài khoản học viên
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                      <img
                        src={presetAvatars[selectedAvatar]}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center border-2 border-white transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  <p className="text-xs text-gray-600 mb-3">
                    Chọn avatar có sẵn
                  </p>
                  <div className="flex gap-2">
                    {presetAvatars.map((avatar, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAvatar(index)}
                        className={`relative w-12 h-12 rounded-full overflow-hidden transition-all border-2 ${
                          selectedAvatar === index
                            ? "border-blue-600"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={avatar}
                          alt={`Avatar ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {selectedAvatar === index && (
                          <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={form.fullname}
                      onChange={(e) =>
                        setForm({ ...form, fullname: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        value={form.dob}
                        onChange={(e) =>
                          setForm({ ...form, dob: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors">
                  Lưu thay đổi
                </button>
              </div>
            )}

            {/* TAB 2: TIẾN ĐỘ HỌC TẬP */}
            {activeTab === "progress" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Tiến độ học tập của bạn
                </h3>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <StatCard
                    icon={<Book className="w-5 h-5 text-blue-600" />}
                    label="Từ đã học"
                    value={stats.wordsLearned.toLocaleString()}
                  />
                  <StatCard
                    icon={<Flame className="w-5 h-5 text-orange-500" />}
                    label="Chuỗi ngày"
                    value={`${stats.streak} ngày`}
                    highlight
                  />
                  <StatCard
                    icon={<Clock className="w-5 h-5 text-green-600" />}
                    label="Tuần này"
                    value={stats.studyTimeWeek}
                  />
                  <StatCard
                    icon={<Star className="w-5 h-5 text-yellow-500" />}
                    label="Độ chính xác"
                    value={`${stats.accuracy}%`}
                  />
                </div>

                {/* Level Progress */}
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        Cấp độ hiện tại
                      </h4>
                      <p className="text-xl font-bold text-blue-600 mt-1">
                        {stats.level}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Bài học hoàn thành</span>
                      <span className="font-medium">
                        {stats.lessonsCompleted}/{stats.totalLessons}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{
                          width: `${(stats.lessonsCompleted / stats.totalLessons) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">
                      Huy hiệu đã đạt được
                    </h4>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                      Xem tất cả
                      <span className="text-xs bg-blue-100 px-2 py-0.5 rounded-full">
                        {badges.length}
                      </span>
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {earnedBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="text-center p-4 rounded-xl border-2 border-yellow-300 bg-yellow-50"
                      >
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <p className="text-xs font-medium text-gray-700">
                          {badge.name}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                          <Award className="w-3 h-3" />
                          Đã đạt
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MỤC TIÊU & CÀI ĐẶT */}
            {activeTab === "goals" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Mục tiêu học tập
                </h3>

                {/* Daily Goals */}
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900">
                      Mục tiêu hàng ngày
                    </h4>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số từ mới mỗi ngày:{" "}
                        <span className="text-blue-600 font-semibold">
                          {goals.dailyWords} từ
                        </span>
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        value={goals.dailyWords}
                        onChange={(e) =>
                          setGoals({
                            ...goals,
                            dailyWords: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>5 từ</span>
                        <span>50 từ</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời gian học mỗi ngày:{" "}
                        <span className="text-blue-600 font-semibold">
                          {goals.dailyTime} phút
                        </span>
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="120"
                        step="10"
                        value={goals.dailyTime}
                        onChange={(e) =>
                          setGoals({
                            ...goals,
                            dailyTime: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>10 phút</span>
                        <span>2 giờ</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="border border-gray-200 rounded-2xl p-5">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Nhắc nhở học tập
                  </h4>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          Bật thông báo
                        </p>
                        <p className="text-xs text-gray-500">
                          Nhận nhắc nhở học tập hàng ngày
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setGoals({
                          ...goals,
                          notifications: !goals.notifications,
                        })
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        goals.notifications ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          goals.notifications ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {goals.notifications && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời gian nhắc nhở
                      </label>
                      <input
                        type="time"
                        value={goals.reminderTime}
                        onChange={(e) =>
                          setGoals({ ...goals, reminderTime: e.target.value })
                        }
                        className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  )}
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors">
                  Lưu cài đặt
                </button>
              </div>
            )}

            {/* TAB 4: BẢO MẬT */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Đổi mật khẩu
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      placeholder="Nhập mật khẩu hiện tại"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors">
                    Đổi mật khẩu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function TabButton({ active, onClick, icon, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-5 py-3 font-medium text-sm transition-colors relative whitespace-nowrap ${
        active ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {icon}
      {children}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
      )}
    </button>
  );
}

function StatCard({ icon, label, value, highlight }: any) {
  return (
    <div
      className={`p-4 rounded-xl border ${highlight ? "bg-orange-50 border-orange-200" : "bg-gray-50 border-gray-200"}`}
    >
      <div className="flex items-center gap-2 mb-2">{icon}</div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-600 mt-1">{label}</div>
    </div>
  );
}
