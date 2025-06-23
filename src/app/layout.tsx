import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "700"], // Adicione os pesos que quiser
  display: "swap",
});

export const metadata: Metadata = {
  title: "My Social App",
  description: "A social media application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={openSans.className}>
        {children}
      </body>
    </html>
  );
}
