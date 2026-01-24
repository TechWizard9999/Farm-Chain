import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: 'swap',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: 'swap',
});

export const metadata = {
  title: "FarmChain - Blockchain Supply Chain Tracker",
  description: "Track food from farm to plate using blockchain technology. Transparent, tamper-proof tracking ensuring authenticity and building trust.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
