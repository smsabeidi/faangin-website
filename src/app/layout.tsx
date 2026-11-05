import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { brand } from "@/lib/site-content";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

// Same font files the production site ships (next/font output), declared the same way:
// Geist 400/500/600 all point at one (variable) latin file; EB Garamond only ships 400.
const geist = localFont({
  src: [
    { path: "../../public/sites/cluely-com-efd0578a/shared/fonts/22a5144ee8d83bca.woff2", weight: "400", style: "normal" },
    { path: "../../public/sites/cluely-com-efd0578a/shared/fonts/22a5144ee8d83bca.woff2", weight: "500", style: "normal" },
    { path: "../../public/sites/cluely-com-efd0578a/shared/fonts/22a5144ee8d83bca.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-geist",
  display: "swap",
});

const ebGaramond = localFont({
  src: [{ path: "../../public/sites/cluely-com-efd0578a/shared/fonts/399c7d2cf805457f.woff2", weight: "400", style: "normal" }],
  variable: "--font-eb-garamond",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const forma = localFont({
  src: [{ path: "../../public/sites/cluely-com-efd0578a/shared/fonts/bfc93208d11e3771.woff2" }],
  variable: "--font-forma",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: brand.title,
  description: brand.description,
  applicationName: brand.name,
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
  openGraph: {
    title: brand.title,
    description: brand.description,
    siteName: brand.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: brand.title,
    description: brand.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#DDE2EE",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${ebGaramond.variable} ${forma.variable}`}>
      <body className="flex min-h-svh flex-col">
        <div className="relative flex grow flex-col rounded-none aria-hidden:[-webkit-mask-image:-webkit-radial-gradient(white,black)]">
          {children}
        </div>
      </body>
    </html>
  );
}
