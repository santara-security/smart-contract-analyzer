import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBarWrapper from "./NavBarWrapper";
import BackgroundAnimation from "./_components/BackgroundAnimation";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Santara Security - Smart Contract Security Analysis",
  description: "Smart Contract Security Analysis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-800 min-h-screen`}
      >
        <Providers>
          <NavBarWrapper />
          <div className="relative min-h-screen">
            <BackgroundAnimation />
            <main className="bg-transparent antialiased overflow-hidden font-geist relative z-10">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
