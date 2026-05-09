import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { isAdmin, ADMIN_NAME } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Promptfolio — Portfolio & Project Tracker",
  description: "บันทึกและแสดงทุกโปรเจคที่คุณสร้าง พร้อม prompt ที่ใช้",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jar = await cookies();
  const userId = jar.get("admin_session")?.value ?? "";
  const username = isAdmin(userId) ? ADMIN_NAME : null;

  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar username={username} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
