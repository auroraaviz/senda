import type { Metadata } from "next";
import { Quicksand, Mulish, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const mulish = Mulish ({
  variable: "--font-mulish",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Senda",
  description: "Organiza y sigue el progreso de tus proyectos académicos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${quicksand.variable} ${mulish.variable} ${plexMono.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col bg-paper text-ink">
          {children}
        </body>
      </html>
  );
}