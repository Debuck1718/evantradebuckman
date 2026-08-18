import type {
  Metadata,
  Viewport,
} from "next";

import "./globals.css";
import {
  IdentitySessionProvider,
} from "../components/identity/IdentitySessionProvider";

const isWorkspace = process.env.EVANTRA_APP_SURFACE === "workspace";
const siteTitle = isWorkspace ? "Evantra Workspace | Life & Work Intelligence OS" : "Evantra Identity | Unified Sovereign Access";
const siteDescription = isWorkspace
  ? "Evantra Workspace is your native operating system for life, work, and promises. Built with cognitive burden defense, zero-knowledge vault, and neural knowledge."
  : "Evantra Identity provides unified, sovereign digital identity, OAuth 2.0 / OIDC authentication, and cryptographic session protection across the Evantra ecosystem.";
const siteUrl = isWorkspace
  ? "https://workspace.evantradebuckman.com"
  : "https://identity.evantradebuckman.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: siteTitle,
    template: `%s | ${isWorkspace ? "Evantra Workspace" : "Evantra Identity"}`,
  },

  description: siteDescription,

  applicationName: isWorkspace ? "Evantra Workspace" : "Evantra Identity",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

  keywords: [
    "Evantra",
    "Evantra Enterprise",
    "Evantra Identity",
    "Evantra Workspace",
    "Evantra Software",
    "Evantra Cybersecurity",
    "Evantra Systems Engineering",
    "Evantra ID",
    "Evantra Cloud",
    "Enterprise SSO",
    "OAuth 2.0 & OIDC",
    "Sovereign Cryptography",
    "Zero-Knowledge Vault",
    "Promise Graph",
    "Cognitive Burden Intelligence",
    "Neural Knowledge Matrix",
    "Mission-Critical Infrastructure",
  ],

  authors: [
    {
      name: "Evantra",
      url: "https://evantradebuckman.com",
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
    siteName: isWorkspace ? "Evantra Workspace" : "Evantra Identity",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: siteTitle,
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
      "@type": "WebApplication",
      name: isWorkspace ? "Evantra Workspace" : "Evantra Identity",
      url: siteUrl,
      description: siteDescription,
      applicationCategory: "BusinessApplication",
      operatingSystem: "All",
      browserRequirements: "Requires JavaScript",
      provider: {
        "@type": "Organization",
        name: "Evantra",
        url: "https://evantradebuckman.com",
        logo: "https://evantradebuckman.com/favicon.ico",
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
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <IdentitySessionProvider>
          {children}
        </IdentitySessionProvider>
      </body>
    </html>
  );
}