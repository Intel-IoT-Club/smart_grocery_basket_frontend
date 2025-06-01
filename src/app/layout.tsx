import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Grocery Basket",
  description: "Scan products to add them to your basket",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}