import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { BillReviewProvider } from "@/context/BillReviewContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bill Parser",
  description: "Gerencie suas contas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <BillReviewProvider>{children}</BillReviewProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
