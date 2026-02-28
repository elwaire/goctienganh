// app/(main)/page.tsx hoặc app/(main)/dashboard/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Trophy,
  Target,
  Flame,
  ChevronRight,
  Play,
  CheckCircle2,
  Star,
  TrendingUp,
  Calendar,
  Zap,
  Award,
  ArrowUpRight,
  BarChart3,
  Layers,
  PenTool,
  Users,
  Palette,
  MousePointer2,
  FileText,
  Sparkles,
  CircleDashed,
  MoreHorizontal,
} from "lucide-react";

// Types
type Course = {
  id: string;
  title: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  icon: React.ElementType;
  color: string;
  lastAccessed?: string;
};

type Activity = {
  id: string;
  type: "lesson" | "quiz" | "achievement";
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
  color: string;
};

type QuickAction = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  href: string;
};

// Mock data
const userStats = {
  name: "Minh",
  streak: 7,
  totalHours: 24.5,
  completedLessons: 45,
  averageScore: 85,
  rank: 12,
  xp: 2450,
  level: 8,
  nextLevelXp: 3000,
};

const courses: Course[] = [
  {
    id: "1",
    title: "UI/UX Fundamentals",
    progress: 75,
    totalLessons: 20,
    completedLessons: 15,
    icon: BookOpen,
    color: "blue",
    lastAccessed: "2 giờ trước",
  },
  {
    id: "2",
    title: "Design Systems",
    progress: 45,
    totalLessons: 15,
    completedLessons: 7,
    icon: Layers,
    color: "purple",
    lastAccessed: "Hôm qua",
  },
  {
    id: "3",
    title: "Figma Mastery",
    progress: 90,
    totalLessons: 25,
    completedLessons: 23,
    icon: PenTool,
    color: "emerald",
    lastAccessed: "3 ngày trước",
  },
  {
    id: "4",
    title: "User Research",
    progress: 20,
    totalLessons: 12,
    completedLessons: 3,
    icon: Users,
    color: "amber",
    lastAccessed: "1 tuần trước",
  },
];

const recentActivities: Activity[] = [
  {
    id: "1",
    type: "lesson",
    title: "Hoàn thành bài học",
    description: "Color Theory & Psychology",
    time: "2 giờ trước",
    icon: CheckCircle2,
    color: "emerald",
  },
  {
    id: "2",
    type: "quiz",
    title: "Hoàn thành quiz",
    description: "UI/UX Fundamentals - 92 điểm",
    time: "5 giờ trước",
    icon: Target,
    color: "blue",
  },
  {
    id: "3",
    type: "achievement",
    title: "Nhận huy hiệu mới",
    description: "7 ngày học liên tiếp 🔥",
    time: "Hôm qua",
    icon: Award,
    color: "amber",
  },
  {
    id: "4",
    type: "lesson",
    title: "Bắt đầu bài học",
    description: "Typography in UI Design",
    time: "Hôm qua",
    icon: Play,
    color: "purple",
  },
];

const quickActions: QuickAction[] = [
  {
    id: "1",
    title: "Tiếp tục học",
    description: "Color Theory & Psychology",
    icon: Play,
    color: "blue",
    href: "/courses/1/lesson/5",
  },
  {
    id: "2",
    title: "Làm quiz",
    description: "3 quiz chưa hoàn thành",
    icon: Target,
    color: "purple",
    href: "/exam",
  },
  {
    id: "3",
    title: "Luyện tập",
    description: "Design Challenge hàng ngày",
    icon: Zap,
    color: "amber",
    href: "/exercises",
  },
  {
    id: "4",
    title: "Flashcards",
    description: "Ôn tập từ vựng Design",
    icon: Layers,
    color: "emerald",
    href: "/flashcards",
  },
];

const upcomingTasks = [
  {
    id: "1",
    title: "Hoàn thành module Typography",
    dueDate: "Hôm nay",
    priority: "high",
  },
  {
    id: "2",
    title: "Nộp bài tập Wireframe",
    dueDate: "Ngày mai",
    priority: "medium",
  },
  {
    id: "3",
    title: "Quiz: Design Principles",
    dueDate: "Trong 3 ngày",
    priority: "low",
  },
];

const weeklyProgress = [
  { day: "T2", hours: 1.5, target: 2 },
  { day: "T3", hours: 2.5, target: 2 },
  { day: "T4", hours: 1, target: 2 },
  { day: "T5", hours: 3, target: 2 },
  { day: "T6", hours: 2, target: 2 },
  { day: "T7", hours: 0.5, target: 2 },
  { day: "CN", hours: 0, target: 2 },
];

const colorMap: Record<
  string,
  { bg: string; bgLight: string; text: string; gradient: string }
> = {
  blue: {
    bg: "bg-blue-500",
    bgLight: "bg-blue-50",
    text: "text-blue-600",
    gradient: "from-blue-500 to-blue-600",
  },
  purple: {
    bg: "bg-purple-500",
    bgLight: "bg-purple-50",
    text: "text-purple-600",
    gradient: "from-purple-500 to-purple-600",
  },
  emerald: {
    bg: "bg-emerald-500",
    bgLight: "bg-emerald-50",
    text: "text-emerald-600",
    gradient: "from-emerald-500 to-emerald-600",
  },
  amber: {
    bg: "bg-amber-500",
    bgLight: "bg-amber-50",
    text: "text-amber-600",
    gradient: "from-amber-500 to-amber-600",
  },
  rose: {
    bg: "bg-rose-500",
    bgLight: "bg-rose-50",
    text: "text-rose-600",
    gradient: "from-rose-500 to-rose-600",
  },
};

export default function DashboardPage() {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Chào buổi sáng"
      : currentHour < 18
        ? "Chào buổi chiều"
        : "Chào buổi tối";

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">
              {greeting}, {userStats.name}! 👋
            </h1>
            <p className="text-neutral-500 mt-1">
              Tiếp tục hành trình học UI/UX của bạn
            </p>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl text-white">
            <Flame className="w-6 h-6" />
            <div>
              <p className="text-2xl font-bold">{userStats.streak}</p>
              <p className="text-xs opacity-90">ngày streak 🔥</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Giờ học"
          value={`${userStats.totalHours}h`}
          trend="+2.5h tuần này"
          color="blue"
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="Bài học"
          value={userStats.completedLessons.toString()}
          trend="+5 tuần này"
          color="emerald"
        />
        <StatCard
          icon={<Target className="w-5 h-5" />}
          label="Điểm TB"
          value={`${userStats.averageScore}%`}
          trend="+3% so với trước"
          color="purple"
        />
        <StatCard
          icon={<Trophy className="w-5 h-5" />}
          label="Xếp hạng"
          value={`#${userStats.rank}`}
          trend="Top 5%"
          color="amber"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-800">
                Hành động nhanh
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action) => {
                const colors = colorMap[action.color];
                const Icon = action.icon;

                return (
                  <Link
                    key={action.id}
                    href={action.href}
                    className="group flex flex-col items-center p-4 bg-white rounded-2xl border border-neutral-100 hover:shadow-lg hover:border-neutral-200 transition-all"
                  >
                    <div
                      className={`w-12 h-12 ${colors.bgLight} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <p className="font-medium text-neutral-800 text-sm text-center">
                      {action.title}
                    </p>
                    <p className="text-xs text-neutral-500 text-center mt-1">
                      {action.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Continue Learning */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-800">
                Tiếp tục học
              </h2>
              <Link
                href="/courses"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Xem tất cả
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {courses.slice(0, 3).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>

          {/* Weekly Progress Chart */}
          <section className="bg-white rounded-2xl border border-neutral-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-neutral-800">
                  Tiến độ tuần này
                </h2>
                <p className="text-sm text-neutral-500">Mục tiêu: 2 giờ/ngày</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-500 rounded" /> Thực tế
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-neutral-200 rounded" /> Mục tiêu
                </span>
              </div>
            </div>
            <div className="flex items-end justify-between gap-2 h-32">
              {weeklyProgress.map((day, index) => {
                const heightPercent = (day.hours / 4) * 100; // Max 4 hours
                const targetHeightPercent = (day.target / 4) * 100;
                const isToday = index === new Date().getDay() - 1;

                return (
                  <div
                    key={day.day}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div className="relative w-full h-24 flex items-end justify-center">
                      {/* Target bar */}
                      <div
                        className="absolute bottom-0 w-full bg-neutral-100 rounded-t-lg"
                        style={{ height: `${targetHeightPercent}%` }}
                      />
                      {/* Actual bar */}
                      <div
                        className={`relative w-3/4 rounded-t-lg transition-all ${
                          day.hours >= day.target
                            ? "bg-gradient-to-t from-emerald-500 to-emerald-400"
                            : "bg-gradient-to-t from-blue-500 to-blue-400"
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isToday ? "text-blue-600" : "text-neutral-500"
                      }`}
                    >
                      {day.day}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-neutral-600">
                  Tổng:{" "}
                  <span className="font-semibold text-neutral-800">
                    10.5 giờ
                  </span>
                </span>
              </div>
              <span className="text-sm text-emerald-600 font-medium">
                +15% so với tuần trước
              </span>
            </div>
          </section>
        </div>

        {/* Right Column - 1/3 */}
        <div className="space-y-6">
          {/* Level Progress */}
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm opacity-80">Level hiện tại</p>
                  <p className="text-2xl font-bold">Level {userStats.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{userStats.xp}</p>
                <p className="text-sm opacity-80">XP</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-80">Tiến độ lên level</span>
                <span className="font-medium">
                  {userStats.xp}/{userStats.nextLevelXp}
                </span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{
                    width: `${(userStats.xp / userStats.nextLevelXp) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs opacity-80 text-center">
                Còn {userStats.nextLevelXp - userStats.xp} XP nữa để lên Level{" "}
                {userStats.level + 1}
              </p>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-400" />
                Nhiệm vụ sắp tới
              </h3>
              <button className="p-1 hover:bg-neutral-100 rounded-lg">
                <MoreHorizontal className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      task.priority === "high"
                        ? "bg-rose-500"
                        : task.priority === "medium"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800 truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-neutral-500">{task.dueDate}</p>
                  </div>
                  <CircleDashed className="w-5 h-5 text-neutral-300" />
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-colors">
              Xem tất cả nhiệm vụ
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-800">
                Hoạt động gần đây
              </h3>
              <Link
                href="/activity"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Xem tất cả
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const colors = colorMap[activity.color];
                const Icon = activity.icon;

                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 ${colors.bgLight} rounded-lg flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-800">
                        {activity.title}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">
                        {activity.description}
                      </p>
                    </div>
                    <span className="text-xs text-neutral-400 whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Challenge */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-neutral-800">
                  Thử thách hôm nay
                </p>
                <p className="text-xs text-amber-600">+50 XP khi hoàn thành</p>
              </div>
            </div>
            <p className="text-sm text-neutral-600 mb-4">
              Thiết kế một button component với 3 trạng thái: default, hover, và
              disabled.
            </p>
            <button className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Bắt đầu thử thách
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  trend,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  color: string;
}) {
  const colors = colorMap[color];

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-10 h-10 ${colors.bgLight} rounded-xl flex items-center justify-center`}
        >
          <span className={colors.text}>{icon}</span>
        </div>
        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
      </div>
      <p className="text-2xl font-bold text-neutral-800">{value}</p>
      <p className="text-sm text-neutral-500">{label}</p>
      <p className={`text-xs ${colors.text} mt-1`}>{trend}</p>
    </div>
  );
}

// Course Card Component
function CourseCard({ course }: { course: Course }) {
  const colors = colorMap[course.color];
  const Icon = course.icon;

  return (
    <div className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-neutral-100 hover:shadow-md hover:border-neutral-200 transition-all">
      {/* Icon */}
      <div
        className={`w-14 h-14 ${colors.bgLight} rounded-xl flex items-center justify-center shrink-0`}
      >
        <Icon className={`w-7 h-7 ${colors.text}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-neutral-800 truncate group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <span className="text-xs text-neutral-400 whitespace-nowrap ml-2">
            {course.lastAccessed}
          </span>
        </div>
        <p className="text-sm text-neutral-500 mb-2">
          {course.completedLessons}/{course.totalLessons} bài học
        </p>
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full transition-all`}
              style={{ width: `${course.progress}%` }}
            />
          </div>
          <span className={`text-sm font-medium ${colors.text}`}>
            {course.progress}%
          </span>
        </div>
      </div>

      {/* Action */}
      <button
        className={`
          w-10 h-10 rounded-xl flex items-center justify-center shrink-0
          opacity-0 group-hover:opacity-100 transition-opacity
          bg-gradient-to-r ${colors.gradient} text-white
        `}
      >
        <Play className="w-5 h-5" />
      </button>
    </div>
  );
}
