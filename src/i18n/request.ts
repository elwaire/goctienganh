import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale, type Locale, locales } from "./config";
import deepmerge from "@/lib/deepmerge";

export default getRequestConfig(async () => {
  // Lấy locale từ cookie (nếu user đã chọn), hoặc dùng mặc định
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("locale")?.value;

  const locale: Locale =
    cookieLocale && locales.includes(cookieLocale as Locale)
      ? (cookieLocale as Locale)
      : defaultLocale;

  // Load và merge các file dịch tách theo screen/feature
  const messageModules = await Promise.all([
    import(`../../messages/${locale}/common.json`),
    import(`../../messages/${locale}/flashcards.json`),
    import(`../../messages/${locale}/exam.json`),
    import(`../../messages/${locale}/vocabulary.json`),
    import(`../../messages/${locale}/feedback.json`),
  ]);

  const messages = messageModules.reduce(
    (merged, mod) => deepmerge(merged, mod.default),
    {} as Record<string, unknown>,
  );

  return {
    locale,
    messages,
  };
});
