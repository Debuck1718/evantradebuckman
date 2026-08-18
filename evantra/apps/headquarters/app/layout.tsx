import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteTitle = "Evantra | Leading Global Enterprise in Software, Cybersecurity & Systems Engineering";
const siteDescription =
  "Evantra is a premier global technology and engineering enterprise. Delivering industry-leading software engineering, sovereign cybersecurity, mission-critical systems architecture, and intelligent enterprise platforms built to compete at global scale.";
const siteUrl = "https://evantradebuckman.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: siteTitle,
    template: "%s | Evantra",
  },

  description: siteDescription,

  applicationName: "Evantra",

  keywords: [
    "Evantra",
    "Evantra Enterprise",
    "Evantra Software",
    "Evantra Cybersecurity",
    "Evantra Systems Engineering",
    "Evantra Global Headquarters",
    "Evantra Technology",
    "Evantra Identity",
    "Evantra Workspace",
    "Evantra Cloud",
    "Enterprise Software Powerhouse",
    "Sovereign Cybersecurity Infrastructure",
    "Mission-Critical Systems",
    "Applied AI Solutions",
    "Zero-Knowledge Architecture",
    "Global Technology Enterprise",
    "High-Growth Tech Firm",
    "StoreForge Platform",
    "Enterprise SSO",
  ],

  authors: [
    {
      name: "Evantra",
      url: siteUrl,
    },
  ],

  creator: "Evantra",
  publisher: "Evantra",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "Evantra",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: "Evantra Global Headquarters & Technology Ecosystem",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    creator: "@evantra",
    images: ["/favicon.ico"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },

  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#06131f",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Corporation",
      "@id": "https://evantradebuckman.com/#organization",
      name: "Evantra",
      legalName: "Evantra",
      url: "https://evantradebuckman.com",
      logo: {
        "@type": "ImageObject",
        url: "https://evantradebuckman.com/favicon.ico",
      },
      description: siteDescription,
      knowsAbout: [
        "Enterprise Software Engineering",
        "Sovereign Cybersecurity & Cryptography",
        "Artificial Intelligence & Cognitive Systems",
        "Mission-Critical Systems Architecture",
        "Global Digital Platforms & Commerce",
        "Cloud & Identity Infrastructure",
      ],
      areaServed: "Global",
      sameAs: [
        "https://github.com/Debuck1718/evantradebuckman",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://evantradebuckman.com/#website",
      url: "https://evantradebuckman.com",
      name: "Evantra",
      publisher: {
        "@id": "https://evantradebuckman.com/#organization",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}