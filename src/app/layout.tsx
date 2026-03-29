import type { Metadata } from "next";
import "@/styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Providers } from "@/components/common/Providers";

export const metadata: Metadata = {
  title: "Goc Tieng Anh",
  description: "Nền tảng học tiếng Anh thông minh",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="bg-background-main text-sm">
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>
              {children}
            </Providers>
          </NextIntlClientProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
