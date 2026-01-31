import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luxe Chocolates | Premium Custom Gifts",
  description: "Handcrafted custom chocolates and premium gifts for every occasion.",
};

import { CartSidebar } from "@/components/layout/CartSidebar";
import { CartProvider } from "@/context/CartContext";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

// ... existing imports ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col bg-chocolate-950 text-white selection:bg-gold-500 selection:text-chocolate-950`}
      >
        <div className="bg-noise" />
        <CartProvider>
          <CartSidebar />
          <LayoutWrapper>{children}</LayoutWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
