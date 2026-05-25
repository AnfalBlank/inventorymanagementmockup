import type { Metadata } from "next";
import { ToastContainer } from "@/components/ui/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "MIMS - Manggala Inventory Management System",
  description: "Warehouse Automation & Inventory Management System untuk PT. Manggala Utama Indonesia",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
