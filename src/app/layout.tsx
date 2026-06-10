import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plate Log",
  description: "Personal food photo calorie tracker",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Plate Log",
  },
};

export const viewport = "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#fafaf9" />
      </head>
      <body className="min-h-full bg-stone-50 text-stone-800">{children}</body>
    </html>
  );
}
