import type { Metadata } from "next";
import { Lexend, Playfair_Display } from "next/font/google";
import { SITE_TITLE, SITE_DESCRIPTION } from "@/lib/constants/SEO";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
