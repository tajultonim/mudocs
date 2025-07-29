import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/authprovider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  category: "Education",
  title: {
    default: "μDocs – Science E-Library and Seminar Archive of RU PHY",
    template: "%s – μDocs",
  },
  description:
    "Explore and access science books, papers, and academic resources from MuDocs contributors and University of Rajshahi, Dept. of Physics seminar library.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-64x64.png", sizes: "64x64", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-128x128.png", sizes: "128x128", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-256x256.png", sizes: "256x256", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
      { url: "/apple-touch-icon-60x60.png", sizes: "60x60" },
      { url: "/apple-touch-icon-76x76.png", sizes: "76x76" },
      { url: "/apple-touch-icon-120x120.png", sizes: "120x120" },
      { url: "/apple-touch-icon-152x152.png", sizes: "152x152" },
      { url: "/apple-touch-icon-167x167.png", sizes: "167x167" },
      { url: "/apple-touch-icon-180x180.png", sizes: "180x180" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#5bbad5" },
    ],
    shortcut: "/favicon.ico",
  },

  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "μDocs – Science e-Library and Seminar Archive of RU PHY",
    countryName: "Bangladesh",
    description:
      "A curated collection of science books, papers, and academic resources from contributors and University of Rajshahi, Dept. of Physics Seminar Library.",
    url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    siteName: "μDocs",
    images: [
      {
        url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/og-1200x630.png`,
        width: 1200,
        height: 630,
        alt: "μDocs – Explore Science Books & Papers",
      },
      {
        url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/og-2500x1313.png`,
        width: 2500,
        height: 1313,
        alt: "μDocs – Explore Science Books & Papers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  facebook: {
    appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
  },
  twitter: {
    card: "summary_large_image",
    title: "μDocs – The Physics e-Library of RU",
    description:
      "Discover physics books and seminar papers from Rajshahi University’s Department of Physics.",
    images: [
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/og-1200x630.png`,
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/og-2500x1313.png`,
    ],
  },
  publisher: "μDocs",
  applicationName: "μDocs",
  keywords: [
    "MuDocs RU",
    "μDocs",
    "mudocs",
    "udocs",
    "RU",
    "Science Library",
    "Physics Books",
    "Seminar Archive",
    "Rajshahi University",
    "RU PHY",
    "Department of Physics",
    "University of Rajshahi",
    "Academic Resources",
    "Research Papers",
  ],
  robots: {
    index: true,
    follow: true,
    noimageindex: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-h-screen`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
