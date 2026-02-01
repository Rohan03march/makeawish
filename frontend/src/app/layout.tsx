import type { Metadata } from "next";
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const script = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Make a wish | Premium Custom Gifts",
  description: "Handcrafted custom chocolates and premium gifts for every occasion.",
};

import { CartSidebar } from "@/components/layout/CartSidebar";
import { CartProvider } from "@/context/CartContext";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

// ... existing imports ...

import { Toaster } from "react-hot-toast";

// ... existing imports ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${script.variable} antialiased min-h-screen flex flex-col bg-chocolate-950 text-white selection:bg-gold-500 selection:text-chocolate-950`}
      >
        <div className="bg-noise" />
        <Toaster position="top-center" toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }} />
        <CartProvider>
          <CartSidebar />
          <LayoutWrapper>{children}</LayoutWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
