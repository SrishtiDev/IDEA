import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/Footer";
import { Navbar1 } from "@/components/ui/navbar-1";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "HireOrbit — Beat the ATS. Land the Interview.",
  description: "AI-powered resume analyzer that simulates enterprise ATS platforms. Get your ATS score, fix rejection risks, and generate a LaTeX-optimized resume in seconds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar1 />
        {children}
        <Footer />
      </body>
    </html>
  );
}
