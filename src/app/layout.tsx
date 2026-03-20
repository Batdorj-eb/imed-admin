import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "iMED Admin",
  description: "iMED Technologies - Бүтээгдэхүүний удирдлагын систем",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={inter.className}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
