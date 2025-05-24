import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import LeftSidebar from "@/components/left-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "μDocs - Home",
  description: "Commie Homies' Very Own File Sharing Platform",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/icon.png" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-h-screen`}
      >
        <Header />
        <div className="grid lg:grid-cols-7 grid-cols-5 px-2 gap-6 lg:px-20">
          <div className=" col-span-1">
            <LeftSidebar />
          </div>
          <main className="lg:col-span-5 col-span-3 pt-6">{children}</main>
          <div className="col-span-1">Sidebar</div>
        </div>
      </body>
    </html>
  );
}
