// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "./globals.css";
import "@mantine/core/styles.css";
import React from "react";
import { MantineProvider, ColorSchemeScript, createTheme } from "@mantine/core";
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

const theme = createTheme({
  fontFamily: "OpenSauceOne",
  fontSizes: {
    xs: "0.625rem",
    sm: "0.75rem",
    md: "0.875rem",
    lg: "1.125rem",
    xl: "1.25rem",
  },
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5c5f66',
      '#373A40',
      '#2C2E33',
      '#25262b',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <div className="safe-area-overlay"></div>
        <MantineProvider
          theme={theme}
          defaultColorScheme="dark"
        >
          {children}
        </MantineProvider>
      </body>
      <GoogleAnalytics gaId="G-J23EFVPLCJ"/>
    </html>
  );
}
