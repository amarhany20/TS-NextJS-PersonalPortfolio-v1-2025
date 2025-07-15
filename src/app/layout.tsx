import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ProfileSidebar from "@/components/ProfileSidebar";
import NavSidebar from "@/components/NavSidebar";
import TopHeader from "@/components/UI/TopHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ammar Hany | Portfolio",
  description: "Personal portfolio website for Ammar Hany",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full overflow-hidden">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground h-full overflow-hidden`}>
        {/* Mobile Header */}
        <TopHeader />

        {/* Fixed Sidebars */}
        <ProfileSidebar />
        <NavSidebar />

        {/* Main Content: fixed, scrollable, between sidebars */}
        <main className="fixed top-0 left-0 right-0 bottom-0 lg:left-[280px] lg:right-[100px] px-4 md:px-8 py-8 pt-14 lg:pt-8 overflow-y-auto" style={{ zIndex: 1 }}>
          <div className="max-w-4xl mx-auto space-y-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
