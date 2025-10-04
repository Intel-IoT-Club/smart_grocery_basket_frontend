import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext"; // <-- 1. IMPORT THIS

export const metadata: Metadata = {
  title: "Smart Grocery Basket",
  description: "Scan products to add them to your basket with ease",
  keywords: ["grocery", "shopping", "barcode", "scanner", "mobile"],
  authors: [{ name: "Smart Grocery Team" }],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#111827",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="min-h-screen bg-gray-950 text-white">
        <AuthProvider> {/* <-- 2. WRAP THE CONTENT */}
          <main className="min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}