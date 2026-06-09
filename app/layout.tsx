import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Sora } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sora",
  display: "swap",
});

const description =
  "Kavyam — a third-year engineer at IIT Ropar building full-stack apps and Solana validator infrastructure. Projects, experience, and a guestbook.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.fullName} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description,
  keywords: [
    "Kavyam",
    "Kavyam Singh",
    "software engineer",
    "Solana",
    "full-stack",
    "IIT Ropar",
    "portfolio",
  ],
  authors: [{ name: site.fullName, url: site.url }],
  creator: site.fullName,
  openGraph: {
    type: "website",
    url: site.url,
    title: `${site.fullName} — ${site.role}`,
    description,
    siteName: `${site.fullName} · Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.fullName} — ${site.role}`,
    description,
    creator: "@KavyamSingh",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07070c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${sora.variable}`}>
        {children}
      </body>
    </html>
  );
}
