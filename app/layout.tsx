import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D Marketplace",
  description: "Buy and sell high-quality 3D models",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900">{children}</body>
    </html>
  );
}
