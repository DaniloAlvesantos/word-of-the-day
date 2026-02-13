import type { Metadata } from "next";
import { Lexend, Fraunces } from "next/font/google";
import { SITE_TITLE, SITE_DESCRIPTION } from "@/lib/constants/SEO";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} ${fraunces.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
