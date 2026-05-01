import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://stacksinau.henss.my.id";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Stack Sinau - Platform E-Learning Interaktif",
    template: "%s | Stack Sinau",
  },
  description:
    "Platform e-learning modern dengan AI Clustering K-Means dan sistem Gamifikasi. Kumpulkan XP, raih badge, dan belajar sesuai gaya belajarmu bersama Stack Sinau.",
  keywords: [
    "e-learning",
    "platform belajar online",
    "gamifikasi belajar",
    "AI clustering",
    "K-Means",
    "mahasiswa",
    "dosen",
    "kursus online",
    "Stack Sinau",
    "XP badge",
    "leaderboard",
  ],
  authors: [{ name: "Tim Stack Sinau" }],
  creator: "Stack Sinau",
  publisher: "Stack Sinau",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Stack Sinau",
    title: "Stack Sinau - Platform E-Learning Interaktif",
    description:
      "Platform e-learning modern dengan AI Clustering K-Means dan sistem Gamifikasi. Kumpulkan XP, raih badge, dan belajar sesuai gaya belajarmu.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stack Sinau - Platform E-Learning Interaktif",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stack Sinau - Platform E-Learning Interaktif",
    description:
      "Platform e-learning modern dengan AI Clustering K-Means dan sistem Gamifikasi. Kumpulkan XP, raih badge, dan belajar sesuai gaya belajarmu.",
    images: ["/og-image.png"],
    creator: "@stacksinau",
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
