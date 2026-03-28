"use client";

import { useState } from "react";
import {
  Camera,
  Check,
  Lock,
  User,
  Mail,
  Phone,
  Calendar,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";

type TabType = "info" | "security";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    fullname: "Võ Ngọc Min",
    email: "elwairestudio@gmail.com",
    phone: "0985940157",
    dob: "2026-02-28",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const presetAvatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=6",
  ];

  const handleSaveProfile = () => {
    console.log("Saving profile:", profileForm);
    // TODO: API call to save profile
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Tài khoản của tôi
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Quản lý thông tin cá nhân và bảo mật
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs Card */}
            <div className="bg-white rounded-2xl border border-gray-200">
              {/* Tabs Header */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors ${
                    activeTab === "info"
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <User className="w-4 h-4" />
                  Thông tin cá nhân
                  {activeTab === "info" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors ${
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

              {/* Tabs Content */}
              <div className="p-6">
                {/* Tab 1: Profile Information */}
                {activeTab === "info" && (
                  <div>
                    <div className="mb-6">
                      <h2 className="font-bold text-gray-900 mb-1">
                        Thông tin cá nhân
                      </h2>
                      <p className="text-xs text-gray-600">
                        Cập nhật thông tin của bạn
                      </p>
                    </div>

                    {/* Avatar Selection */}
                    <div className="mb-6 pb-6 border-b border-gray-200">
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
                          Chọn avatar
                        </p>
                        <div className="flex gap-2 flex-wrap justify-center">
                          {presetAvatars.map((avatar, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedAvatar(index)}
                              className={`relative w-12 h-12 rounded-full overflow-hidden transition-all border-2 ${
                                selectedAvatar === index
                                  ? "border-blue-600 scale-110"
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
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={profileForm.fullname}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                fullname: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Nhập họ và tên"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                email: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="email@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số điện thoại
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="tel"
                              value={profileForm.phone}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  phone: e.target.value,
                                })
                              }
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="0123456789"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ngày sinh
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="date"
                              value={profileForm.dob}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  dob: e.target.value,
                                })
                              }
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveProfile}
                      className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                )}

                {/* Tab 2: Security (Change Password) */}
                {activeTab === "security" && (
                  <div>
                    <div className="mb-6">
                      <h2 className="font-bold text-gray-900 mb-1">
                        Đổi mật khẩu
                      </h2>
                      <p className="text-xs text-gray-600">
                        Cập nhật mật khẩu của bạn để bảo mật tài khoản
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu hiện tại{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                currentPassword: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Nhập mật khẩu hiện tại"
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu mới <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                newPassword: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Nhập mật khẩu mới"
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Xác nhận mật khẩu mới{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Nhập lại mật khẩu mới"
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

                    {/* Password Requirements */}
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-xs font-medium text-blue-900 mb-2">
                        Yêu cầu mật khẩu:
                      </p>
                      <ul className="space-y-1 text-xs text-gray-700">
                        <li>• Tối thiểu 8 ký tự</li>
                        <li>• Kết hợp chữ hoa, chữ thường</li>
                        <li>• Có ít nhất 1 số</li>
                        <li>• Có ít nhất 1 ký tự đặc biệt (!@#$%...)</li>
                      </ul>
                    </div>

                    <button
                      onClick={handleChangePassword}
                      disabled={
                        !passwordForm.currentPassword ||
                        !passwordForm.newPassword ||
                        !passwordForm.confirmPassword
                      }
                      className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                      Đổi mật khẩu
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Info Cards */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4">
                Trạng thái tài khoản
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                  <span className="text-sm font-medium text-gray-700">
                    Trạng thái
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-md">
                    <Check className="w-3 h-3" />
                    Đang hoạt động
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-sm font-medium text-gray-700">
                    Loại tài khoản
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    Miễn phí
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-sm font-medium text-gray-700">
                    Ngày tham gia
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    15/03/2024
                  </span>
                </div>
              </div>
            </div>

            {/* Security Tips - Only show when on security tab */}
            {activeTab === "security" && (
              <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-gray-900 text-sm">
                    Bảo mật tài khoản
                  </h3>
                </div>

                <div className="space-y-2 text-xs text-gray-700">
                  <p>• Sử dụng mật khẩu mạnh (8+ ký tự)</p>
                  <p>• Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</p>
                  <p>• Không chia sẻ mật khẩu với người khác</p>
                  <p>• Đổi mật khẩu định kỳ (3-6 tháng)</p>
                </div>
              </div>
            )}

            {/* Help */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">
                Cần hỗ trợ?
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Nếu bạn gặp vấn đề với tài khoản hoặc cần hỗ trợ, vui lòng liên
                hệ với chúng tôi.
              </p>
              <button className="w-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-medium py-2 rounded-lg transition-colors text-sm">
                Liên hệ hỗ trợ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
