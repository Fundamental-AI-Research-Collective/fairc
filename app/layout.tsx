import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import Image from "next/image";
import "katex/dist/katex.min.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "FAIRC | Fundamental AI Research Collective",
    template: "%s | FAIRC",
  },
  description:
    "FAIRC is a research collective for fundamental AI research, working at the boundary of theory and experiment — from mathematical foundations to AI safety and embodied agents.",
  openGraph: {
    title: "FAIRC | Fundamental AI Research Collective",
    description:
      "We work at the boundary of theory and experiment, driven by the conviction that the deepest questions in AI require rigorous, first-principles investigation.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "FAIRC | Fundamental AI Research Collective",
    description:
      "A research collective for fundamental AI research — safety, interpretability, neuroscience-inspired intelligence, and more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable}`}
    >
      <body>
        <div className="site-wrapper">
          <div style={{ position: "fixed", top: "1.5rem", right: "2rem", zIndex: 200, opacity: 0.9 }}>
            <Image
              src="/assets/fairc-logo.png"
              alt="FAIRC"
              width={200}
              height={100}
              priority
            />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
