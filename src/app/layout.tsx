import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartCrowd AI - Stadium Intelligence",
  description: "Real-time stadium crowd management and AI assistant for operators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
