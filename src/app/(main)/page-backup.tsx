"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Flame,
  Trophy,
  TrendingUp,
  Clock,
  Target,
  Play,
  ChevronRight,
  Star,
  Award,
  Users,
  Calendar,
  Zap,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [currentStreak, setCurrentStreak] = useState(15);

  // Mock data
  const user = {
    name: "Võ Ngọc Min",
    level: "Intermediate (B1)",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=min",
  };

  const todayGoal = {
    wordsTarget: 20,
    wordsCompleted: 12,
    timeTarget: 30, // minutes
    timeCompleted: 18,
  };

  const stats = {
    totalWords: 1245,
    streak: 15,
    studyTime: "3h 24m",
    accuracy: 87,
  };

  const recentDecks = [
    {
      id: "1",
      title: "TOEIC Vocabulary - Part 1",
      wordCount: 150,
      progress: 87,
      lastStudied: "2 giờ trước",
    },
    {
      id: "2",
      title: "Business English",
      wordCount: 200,
      progress: 45,
      lastStudied: "Hôm qua",
    },
    {
      id: "3",
      title: "Daily Conversation",
      wordCount: 80,
      progress: 100,
      lastStudied: "3 ngày trước",
    },
  ];

  const quickActions = [
    {
      id: "practice",
      title: "Luyện tập",
      description: "Bắt đầu học ngay",
      icon: <Play className="w-6 h-6" />,
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
      path: "/practice",
    },
    {
      id: "vocabulary",
      title: "Bộ từ vựng",
      description: "Quản lý từ vựng",
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-green-600",
      hoverColor: "hover:bg-green-700",
      path: "/vocabulary-set",
    },
    {
      id: "rank",
      title: "Xếp hạng",
      description: "Xem bảng xếp hạng",
      icon: <Trophy className="w-6 h-6" />,
      color: "bg-yellow-600",
      hoverColor: "hover:bg-yellow-700",
      path: "/rank",
    },
  ];

  const achievements = [
    { id: 1, icon: "🔥", name: "15 Days Streak", unlocked: true },
    { id: 2, icon: "📚", name: "1000 Words", unlocked: true },
    { id: 3, icon: "⭐", name: "Perfect Week", unlocked: true },
    { id: 4, icon: "🎯", name: "Sharp Shooter", unlocked: false },
  ];

  const wordsProgress =
    (todayGoal.wordsCompleted / todayGoal.wordsTarget) * 100;
  const timeProgress = (todayGoal.timeCompleted / todayGoal.timeTarget) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Xin chào, {user.name}! 👋
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                Hãy tiếp tục hành trình học tập của bạn
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-600 bg-white">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Goal */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">
                      Mục tiêu hôm nay
                    </h2>
                    <p className="text-xs text-gray-600">
                      Hoàn thành để duy trì chuỗi ngày
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame className="w-5 h-5" />
                  <span className="font-bold text-lg">{currentStreak}</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Words Goal */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Từ mới
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {todayGoal.wordsCompleted}/{todayGoal.wordsTarget}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${wordsProgress}%` }}
                    />
                  </div>
                </div>

                {/* Time Goal */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Thời gian học
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {todayGoal.timeCompleted}/{todayGoal.timeTarget} phút
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 rounded-full transition-all duration-500"
                      style={{ width: `${timeProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {wordsProgress >= 100 && timeProgress >= 100 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    🎉 Bạn đã hoàn thành mục tiêu hôm nay!
                  </span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => router.push(action.path)}
                  className={`${action.color} ${action.hoverColor} text-white rounded-2xl p-4 transition-all hover:scale-105 hover:shadow-lg group`}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      {action.icon}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{action.title}</p>
                      <p className="text-xs opacity-90 mt-0.5">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Recent Decks */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Tiếp tục học</h2>
                <button
                  onClick={() => router.push("/vocabulary-set")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  Xem tất cả
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {recentDecks.map((deck) => (
                  <button
                    key={deck.id}
                    onClick={() => router.push(`/vocabulary-set/${deck.id}`)}
                    className="w-full p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl transition-all text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate group-hover:text-blue-600">
                          {deck.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span>{deck.wordCount} từ</span>
                          <span>•</span>
                          <span>{deck.lastStudied}</span>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {deck.progress}%
                        </div>
                        <div className="text-xs text-gray-600">Hoàn thành</div>
                      </div>
                    </div>

                    {/* Mini progress bar */}
                    <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${deck.progress}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Thống kê</h3>
              <div className="space-y-4">
                <StatItem
                  icon={<BookOpen className="w-5 h-5 text-blue-600" />}
                  label="Từ đã học"
                  value={stats.totalWords.toLocaleString()}
                  bgColor="bg-blue-50"
                />
                <StatItem
                  icon={<Flame className="w-5 h-5 text-orange-500" />}
                  label="Chuỗi ngày"
                  value={`${stats.streak} ngày`}
                  bgColor="bg-orange-50"
                  highlight
                />
                <StatItem
                  icon={<Clock className="w-5 h-5 text-green-600" />}
                  label="Thời gian học"
                  value={stats.studyTime}
                  bgColor="bg-green-50"
                />
                <StatItem
                  icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
                  label="Độ chính xác"
                  value={`${stats.accuracy}%`}
                  bgColor="bg-purple-50"
                />
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Thành tích</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Xem tất cả
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-xl border-2 text-center ${
                      achievement.unlocked
                        ? "bg-yellow-50 border-yellow-300"
                        : "bg-gray-50 border-gray-200 opacity-50"
                    }`}
                  >
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <p className="text-xs font-medium text-gray-700">
                      {achievement.name}
                    </p>
                    {achievement.unlocked && (
                      <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                        <Award className="w-3 h-3" />
                        Đã đạt
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Khám phá</h3>
              </div>

              <div className="space-y-2">
                <QuickLink
                  icon={<Users className="w-4 h-4" />}
                  label="Xem bảng xếp hạng"
                  onClick={() => router.push("/rank")}
                />
                <QuickLink
                  icon={<Calendar className="w-4 h-4" />}
                  label="Lịch sử luyện tập"
                  onClick={() => router.push("/history")}
                />
                <QuickLink
                  icon={<Star className="w-4 h-4" />}
                  label="Bộ từ công khai"
                  onClick={() => router.push("/vocabulary-set?tab=public")}
                />
              </div>
            </div>

            {/* Motivation Quote */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-sm mb-2">
                    "Học một chút mỗi ngày tốt hơn học nhiều một lúc"
                  </p>
                  <p className="text-xs text-blue-100">
                    Hãy kiên trì với mục tiêu của bạn! 💪
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({
  icon,
  label,
  value,
  bgColor,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bgColor: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`${bgColor} rounded-xl p-3 ${highlight ? "ring-2 ring-orange-300" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{icon}</div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-600 truncate">{label}</p>
          <p className="text-lg font-bold text-gray-900 truncate">{value}</p>
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 p-2 hover:bg-blue-100 rounded-lg transition-colors text-left group"
    >
      <div className="text-blue-600">{icon}</div>
      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
        {label}
      </span>
      <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-blue-600" />
    </button>
  );
}
