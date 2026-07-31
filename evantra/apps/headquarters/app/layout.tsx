import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Evantra Headquarters",
    template: "%s | Evantra",
  },

  description: "Engineering Technology That Serves People.",

  applicationName: "Evantra Headquarters",

  keywords: [
    "Evantra",
    "Engineering",
    "Technology",
    "Innovation",
    "Artificial Intelligence",
    "Cybersecurity",
    "Research",
    "Software",
    "Import and Export",
  ],

  authors: [
    {
      name: "Evantra De-Buckman Ventures",
    },
  ],

  creator: "Evantra",

  publisher: "Evantra",

  metadataBase: new URL("https://evantradebuckman.com"),

  openGraph: {
    title: "Evantra Headquarters",
    description: "Engineering Technology That Serves People.",
    siteName: "Evantra",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Evantra Headquarters",
    description: "Engineering Technology That Serves People.",
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B4F71",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}