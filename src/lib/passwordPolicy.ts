/**
 * Validation mật khẩu mới — mirror quy tắc BE (password_policy / ChangePasswordRequest).
 * Ký tự đặc biệt: tương đương unicode punctuation + symbol (và `_`).
 */

const HAS_UPPER = /\p{Lu}/u;
const HAS_LOWER = /\p{Ll}/u;
const HAS_DIGIT = /\d/;
/** Punctuation + Symbol (Unicode), thêm `_` (Pc) để khớp ví dụ thường gặp */
const HAS_SPECIAL = /(?:[\p{P}\p{S}]|_)/u;

export type PasswordPolicyResult = {
  ok: boolean;
  /** Thông báo tiếng Việt cho từng điều kiện chưa đạt */
  errors: string[];
};

export function validateNewPasswordPolicy(password: string): PasswordPolicyResult {
  const errors: string[] = [];
  if (password.length < 8) {
    errors.push("Tối thiểu 8 ký tự");
  }
  if (!HAS_UPPER.test(password)) {
    errors.push("Có ít nhất một chữ hoa");
  }
  if (!HAS_LOWER.test(password)) {
    errors.push("Có ít nhất một chữ thường");
  }
  if (!HAS_DIGIT.test(password)) {
    errors.push("Có ít nhất một chữ số");
  }
  if (!HAS_SPECIAL.test(password)) {
    errors.push("Có ít nhất một ký tự đặc biệt (!@#$%, _, …)");
  }
  return { ok: errors.length === 0, errors };
}

export type ChangePasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

/** Đủ điều kiện gọi API: điền đủ, khớp xác nhận, mới ≠ hiện tại, policy mật khẩu mới */
export function isChangePasswordFormValid(form: ChangePasswordForm): boolean {
  const { currentPassword, newPassword, confirmPassword } = form;
  if (!currentPassword.trim() || !newPassword || !confirmPassword) {
    return false;
  }
  if (newPassword !== confirmPassword) return false;
  if (newPassword === currentPassword) return false;
  return validateNewPasswordPolicy(newPassword).ok;
}

/** Gợi ý lỗi client trước khi gửi (nút có thể vẫn bật nhờ isChangePasswordFormValid) */
export function getChangePasswordClientHint(form: ChangePasswordForm): string | null {
  const { currentPassword, newPassword, confirmPassword } = form;
  if (!currentPassword.trim() || !newPassword || !confirmPassword) return null;
  if (newPassword !== confirmPassword) {
    return "Mật khẩu xác nhận không khớp.";
  }
  if (newPassword === currentPassword) {
    return "Mật khẩu mới phải khác mật khẩu hiện tại.";
  }
  const policy = validateNewPasswordPolicy(newPassword);
  if (!policy.ok) {
    return policy.errors[0] ?? "Mật khẩu mới chưa đủ mạnh.";
  }
  return null;
}
