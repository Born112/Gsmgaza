import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/cart-store";
import { LangProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "GSMBaza — Запчасти для смартфонов и сервисный центр",
  description: "Более 12 000 оригинальных запчастей для любых моделей. Профессиональный ремонт смартфонов с гарантией.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-slate-100">
        <LangProvider><CartProvider>
          <Header isLoggedIn={false} />
          <div className="flex-1">{children}</div>
          <Footer />
        </CartProvider></LangProvider>
      </body>
    </html>
  );
}
