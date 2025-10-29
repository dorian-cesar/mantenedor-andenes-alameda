import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Accesos Terminal Alameda",
  description: "Dashboard de administración de accesos para terminal Alameda.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-linear-to-br from-blue-50 to-indigo-100 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
