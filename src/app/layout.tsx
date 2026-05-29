import type { Metadata } from "next";
import { Inter, Unbounded } from "next/font/google";

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
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>{children}</body>
    </html>
  );
}

