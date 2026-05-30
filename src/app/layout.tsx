import type { Metadata } from "next";
import { Inter, Unbounded } from "next/font/google";

import { DemoAuthProvider } from "@/shared/providers/demo-auth-provider";
import { FirebaseNotificationsProvider } from "@/shared/providers/firebase-notifications-provider";
import { QueryProvider } from "@/shared/providers/query-provider";
import { MobileTabNav } from "@/widgets/home/mobile-tab-nav";

import "./globals.css";

const headingFont = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-heading",
});

const bodyFont = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Заначка",
  description: "Мобильный финансовый дашборд по Figma-макету.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        <QueryProvider>
          <DemoAuthProvider>
            <FirebaseNotificationsProvider>
              {children}
              <MobileTabNav />
            </FirebaseNotificationsProvider>
          </DemoAuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

