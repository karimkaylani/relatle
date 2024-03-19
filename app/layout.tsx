// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "./globals.css";
import "@mantine/core/styles.css";
import React from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata = {
  title: "relatle",
  description: "Connect two artists together using their related artists!",
  url: "https://relatle.io",
  siteName: "relatle",
  metadataBase: new URL("https://relatle.io"),
  robots: {
    index: true,
    follow: true,
  },
};

export const runtime = "edge";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider
          theme={{
            fontFamily: "OpenSauceOne",
            fontSizes: {
              xs: "0.625rem",
              sm: "0.75rem",
              md: "0.875rem",
              lg: "1.125rem",
              xl: "1.25rem",
            },
          }}
          defaultColorScheme="dark"
        >
          {children}
        </MantineProvider>
      </body>
      <GoogleAnalytics gaId="G-J23EFVPLCJ"/>
    </html>
  );
}
