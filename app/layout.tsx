import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import { GoogleAnalytics } from "@next/third-parties/google";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Mugox — Free Online Tools, No Login Required`,
    template: `%s | Mugox`,
  },
  description: siteConfig.description,
  keywords: [
    "free online tools",
    "pdf tools",
    "image tools",
    "text tools",
    "no login",
    "browser based",
    "free converter",
  ],
  authors: [{ name: "Mugox" }],
  creator: "Mugox",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: "Mugox",
    title: "Mugox — Free Online Tools",
    description: siteConfig.description,
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Mugox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mugox — Free Online Tools",
    description: siteConfig.description,
    creator: siteConfig.twitterHandle,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('mg-theme')||'system';var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t==='system'&&d)){document.documentElement.classList.add('dark')}})()`,
          }}
        />
        <meta name="google-adsense-account" content="ca-pub-5610861089372226"></meta>
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
        <GoogleAnalytics gaId="G-M41DBV4SED" />
      </body>
    </html>
  );
}
