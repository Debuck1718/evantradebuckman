import type {
  Metadata,
  Viewport,
} from "next";

import "./globals.css";
import {
  IdentitySessionProvider,
} from "../components/identity/IdentitySessionProvider";

export const metadata: Metadata = {
  title: {
    default: "Evantra Identity",
    template: "%s | Evantra Identity",
  },

  description:
    "Secure identity infrastructure for the Evantra digital ecosystem.",

  applicationName:
    "Evantra Identity",

  keywords: [
    "Evantra",
    "Evantra Identity",
    "Evantra ID",
    "Authentication",
    "Identity",
    "Security",
  ],
};

export const viewport: Viewport = {
  themeColor: "#06131f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <IdentitySessionProvider>
          {children}
        </IdentitySessionProvider>
      </body>
    </html>
  );
}