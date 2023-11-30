// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "./globals.css"
import '@mantine/core/styles.css';
import { MantineProvider, ColorSchemeScript, createTheme, Button } from '@mantine/core';
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: 'relatle',
  description: 'A wordle-type game where you go from one music artist to another through their related artists',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={{
          fontFamily: 'RelativePro',
        }} defaultColorScheme="dark">{children}</MantineProvider>
        <Analytics/>
      </body>
    </html>
  );
}