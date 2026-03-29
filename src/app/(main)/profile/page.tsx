"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  Camera,
  Check,
  Lock,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Eye,
  EyeOff,
  Shield,
  Edit2,
  X as XIcon,
  AlertCircle,
  Target,
  Heart,
  BookOpen,
  Award,
  Loader2,
} from "lucide-react";
import { userApi, avatarUrl } from "@/api/userApi";
import { getAccessToken } from "@/lib/auth";
import { setUser } from "@/store/authSlice";
import type { RootState } from "@/store";
import type { User } from "@/types/auth";
import { dobToDateInput } from "@/types/auth";

type TabType = "info" | "security";

function formStateFromUser(u: User) {
  return {
    fullname: u.fullname ?? "",
    email: u.email ?? "",
    phone: u.phone ?? "",
    dob: dobToDateInput(u.dob) || "",
    bio: u.bio ?? "",
    goal: u.goal ?? "",
    level: u.current_level ?? "",
    interests: u.interests ?? "",
  };
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);

  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [profileForm, setProfileForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    dob: "",
    bio: "",
    goal: "",
    level: "",
    interests: "",
  });

  const canLoadProfile = !!getAccessToken() || isAuthenticated;

  const {
    data: userMe,
    isLoading: profileLoading,
    isError: profileLoadError,
  } = useQuery({
    queryKey: ["user", "me"],
    queryFn: () => userApi.getMe(),
    enabled: canLoadProfile,
    staleTime: 60_000,
  });

  const { data: avatarList, isLoading: avatarsLoading } = useQuery({
    queryKey: ["avatars", "presets"],
    queryFn: () => userApi.getAvatars({ limit: 100 }),
    enabled: canLoadProfile && isEditing,
  });

  const presetAvatarUrls = useMemo(() => {
    const presets = avatarList?.avatars ?? [];
    const urls = presets.map(avatarUrl).filter(Boolean);
    if (selectedAvatarUrl && !urls.includes(selectedAvatarUrl)) {
      return [selectedAvatarUrl, ...urls];
    }
    return urls.length ? urls : selectedAvatarUrl ? [selectedAvatarUrl] : [];
  }, [avatarList?.avatars, selectedAvatarUrl]);

  useEffect(() => {
    if (!userMe) return;
    setProfileForm(formStateFromUser(userMe));
    setSelectedAvatarUrl(userMe.avatar ?? "");
  }, [userMe]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const updateProfileMutation = useMutation({
    mutationFn: () =>
      userApi.updateProfile({
        fullname: profileForm.fullname,
        avatar: selectedAvatarUrl,
        phone: profileForm.phone,
        dob: profileForm.dob || undefined,
        bio: profileForm.bio,
        current_level: profileForm.level,
        goal: profileForm.goal,
        interests: profileForm.interests,
      }),
    onSuccess: (updated) => {
      dispatch(setUser(updated));
      queryClient.setQueryData(["user", "me"], updated);
      setProfileError("");
      setIsEditing(false);
    },
    onError: (e: unknown) => {
      const msg =
        e && typeof e === "object" && "response" in e
          ? (e as { response?: { data?: { message?: string } } }).response?.data
              ?.message
          : undefined;
      setProfileError(msg || "Không thể lưu hồ sơ. Thử lại sau.");
    },
  });

  const levelOptions = [
    "Beginner (A1)",
    "Elementary (A2)",
    "Intermediate (B1)",
    "Upper Intermediate (B2)",
    "Advanced (C1)",
    "Proficient (C2)",
  ];

  const handleSaveProfile = () => {
    setProfileError("");
    updateProfileMutation.mutate();
  };

  const handleCancelEdit = () => {
    if (userMe) {
      setProfileForm(formStateFromUser(userMe));
      setSelectedAvatarUrl(userMe.avatar ?? "");
    }
    setProfileError("");
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    console.log("Changing password");
    // TODO: API call to change password
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!mounted) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!canLoadProfile) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 max-w-md mx-auto text-center p-6">
        <p className="text-gray-600">Đăng nhập để xem và chỉnh sửa hồ sơ.</p>
        <Link
          href="/login"
          className="text-blue-600 font-medium hover:underline"
        >
          Đăng nhập
        </Link>
      </div>
    );
  }

  if (profileLoading && !userMe) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm text-gray-500">Đang tải hồ sơ...</p>
      </div>
    );
  }

  if (profileLoadError || !userMe) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 p-6 text-center">
        <AlertCircle className="w-10 h-10 text-amber-500" />
        <p className="text-gray-600 text-sm">
          Không tải được hồ sơ. Thử đăng nhập lại.
        </p>
        <Link
          href="/login"
          className="text-blue-600 font-medium hover:underline"
        >
          Đăng nhập
        </Link>
      </div>
    );
  }

  const displayAvatarUrl = selectedAvatarUrl || userMe.avatar || "";

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tài khoản</h1>
          <p className="text-gray-600 mt-1 text-sm">
            Quản lý thông tin và bảo mật
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 px-1">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === "info"
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  Thông tin
                  {activeTab === "info" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === "security"
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Bảo mật
                  {activeTab === "security" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Tab 1: Info */}
                {activeTab === "info" && (
                  <div>
                    {!isEditing ? (
                      /* View Mode */
                      <div>
                        {/* Avatar & Name */}
                        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-200">
                          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex-shrink-0">
                            {displayAvatarUrl ? (
                              <img
                                src={displayAvatarUrl}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-medium bg-gray-200">
                                {(profileForm.fullname || "?").slice(0, 1).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold text-gray-900 truncate">
                              {profileForm.fullname}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                <Award className="w-3 h-3" />
                                {profileForm.level}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors flex-shrink-0"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Bio Section */}
                        {profileForm.bio && (
                          <div className="mb-5 pb-5 border-b border-gray-200">
                            <div className="flex items-start gap-3">
                              <UserIcon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-600 mb-1">
                                  Giới thiệu
                                </p>
                                <p className="text-sm text-gray-900 leading-relaxed">
                                  {profileForm.bio}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Goals & Interests */}
                        <div className="mb-5 pb-5 border-b border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                              <Target className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-600 mb-1">
                                  Mục tiêu
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {profileForm.goal || "Chưa đặt mục tiêu"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Heart className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-600 mb-1">
                                  Sở thích
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {profileForm.interests || "Chưa cập nhật"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-3">
                          <InfoRow
                            icon={<Mail className="w-4 h-4 text-gray-400" />}
                            label="Email"
                            value={profileForm.email}
                          />
                          <InfoRow
                            icon={<Phone className="w-4 h-4 text-gray-400" />}
                            label="Số điện thoại"
                            value={profileForm.phone || "Chưa cập nhật"}
                          />
                          <InfoRow
                            icon={
                              <Calendar className="w-4 h-4 text-gray-400" />
                            }
                            label="Ngày sinh"
                            value={
                              profileForm.dob
                                ? formatDate(profileForm.dob)
                                : "Chưa cập nhật"
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      /* Edit Mode */
                      <div>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-gray-900">
                            Chỉnh sửa thông tin
                          </h3>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <XIcon className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Avatar Selection */}
                        <div className="mb-5 pb-5 border-b border-gray-200">
                          <div className="flex items-center gap-4">
                            <div className="relative flex-shrink-0">
                              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                                {displayAvatarUrl ? (
                                  <img
                                    src={displayAvatarUrl}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-medium bg-gray-200">
                                    {(profileForm.fullname || "?")
                                      .slice(0, 1)
                                      .toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center border-2 border-white transition-colors">
                                <Camera className="w-3.5 h-3.5 text-white" />
                              </button>
                            </div>

                            <div className="flex-1">
                              <p className="text-xs text-gray-600 mb-2">
                                Chọn avatar
                                {avatarsLoading && " (đang tải...)"}
                              </p>
                              <div className="flex gap-2 flex-wrap">
                                {presetAvatarUrls.map((url) => (
                                  <button
                                    key={url}
                                    type="button"
                                    onClick={() => setSelectedAvatarUrl(url)}
                                    className={`relative w-10 h-10 rounded-full overflow-hidden transition-all border-2 ${
                                      selectedAvatarUrl === url
                                        ? "border-blue-600 scale-105"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                                  >
                                    <img
                                      src={url}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />
                                    {selectedAvatarUrl === url && (
                                      <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-blue-600" />
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={profileForm.fullname}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  fullname: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="Nhập họ và tên"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Giới thiệu bản thân
                            </label>
                            <textarea
                              value={profileForm.bio}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  bio: e.target.value,
                                })
                              }
                              rows={3}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                              placeholder="Viết vài dòng về bản thân, mục tiêu học tập..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Tối đa 200 ký tự
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Trình độ hiện tại
                              </label>
                              <select
                                value={profileForm.level}
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    level: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              >
                                {levelOptions.map((level) => (
                                  <option key={level} value={level}>
                                    {level}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Mục tiêu
                              </label>
                              <input
                                type="text"
                                value={profileForm.goal}
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    goal: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="Ví dụ: IELTS 7.0"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Sở thích
                            </label>
                            <input
                              type="text"
                              value={profileForm.interests}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  interests: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="Du lịch, Phim, Âm nhạc..."
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              readOnly
                              disabled
                              value={profileForm.email}
                              title="Email không đổi qua hồ sơ"
                              className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600 cursor-not-allowed"
                              placeholder="email@example.com"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Email đăng nhập chỉ hiển thị, không sửa tại đây.
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Số điện thoại
                              </label>
                              <input
                                type="tel"
                                value={profileForm.phone}
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    phone: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="0123456789"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Ngày sinh
                              </label>
                              <input
                                type="date"
                                value={profileForm.dob}
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    dob: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        {profileError && (
                          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            {profileError}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 mt-5">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            disabled={updateProfileMutation.isPending}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50"
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveProfile}
                            disabled={updateProfileMutation.isPending}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50 inline-flex items-center justify-center gap-2"
                          >
                            {updateProfileMutation.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Đang lưu...
                              </>
                            ) : (
                              "Lưu"
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Security */}
                {activeTab === "security" && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">
                      Đổi mật khẩu
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                          Mật khẩu hiện tại{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                currentPassword: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                          Mật khẩu mới <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                newPassword: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                          Xác nhận mật khẩu{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-blue-900 mb-1">
                            Yêu cầu mật khẩu:
                          </p>
                          <ul className="space-y-0.5 text-xs text-gray-700">
                            <li>• Tối thiểu 8 ký tự</li>
                            <li>• Có chữ hoa, chữ thường và số</li>
                            <li>• Có ký tự đặc biệt (!@#$%...)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Button */}
                    <button
                      onClick={handleChangePassword}
                      disabled={
                        !passwordForm.currentPassword ||
                        !passwordForm.newPassword ||
                        !passwordForm.confirmPassword
                      }
                      className="w-full mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
                    >
                      Đổi mật khẩu
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">
                Trạng thái
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-xs font-medium text-gray-700">
                    Tài khoản
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-600 text-white text-xs font-medium rounded">
                    <Check className="w-3 h-3" />
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-600">Loại</span>
                  <span className="text-xs font-semibold text-gray-900">
                    Miễn phí
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-600">Tham gia</span>
                  <span className="text-xs font-semibold text-gray-900">
                    {userMe.created_at
                      ? formatDate(userMe.created_at)
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Learning Stats - Only on info tab */}
            {activeTab === "info" && (
              <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-gray-900 text-sm">Học tập</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700">Từ đã học</span>
                    <span className="text-xs font-bold text-blue-900">
                      1,245
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700">Chuỗi ngày</span>
                    <span className="text-xs font-bold text-orange-600">
                      15 🔥
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700">Độ chính xác</span>
                    <span className="text-xs font-bold text-green-600">
                      87%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tips (Only on security tab) */}
            {activeTab === "security" && (
              <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-gray-900 text-sm">
                    Tips bảo mật
                  </h3>
                </div>

                <ul className="space-y-1.5 text-xs text-gray-700">
                  <li>• Dùng mật khẩu mạnh</li>
                  <li>• Không chia sẻ với ai</li>
                  <li>• Đổi định kỳ 3-6 tháng</li>
                  <li>• Kết hợp chữ, số, ký tự</li>
                </ul>
              </div>
            )}

            {/* Help */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 mb-2 text-sm">
                Cần hỗ trợ?
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Liên hệ nếu gặp vấn đề
              </p>
              <button className="w-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-medium py-2 rounded-lg transition-colors text-xs">
                Liên hệ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact Info Row
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0 text-gray-400">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-600">{label}</p>
        <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
}
