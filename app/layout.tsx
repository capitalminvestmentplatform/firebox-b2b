import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Oswald, Roboto } from "next/font/google";
import AppLayout from "./components/AppLayout";
import { Toaster } from "@/components/ui/sonner";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"], // Supports multiple languages
  weight: ["400", "700"], // Load specific weights
  variable: "--font-inter", // CSS variable name
});

// Configure fonts
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700"], // adjust as needed
  display: "swap",
});

export const metadata: Metadata = {
  title: "Firebox B2B",
  description: "embracing the future of finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oswald.variable} ${roboto.variable}`}>
      <body>
        <main className="bg-primaryColor">
          <Providers>
            <AppLayout>{children}</AppLayout>
          </Providers>
        </main>
        <Toaster className="bg-white" />
      </body>
    </html>
  );
}
