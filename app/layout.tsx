// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "./globals.css"
import '@mantine/core/styles.css';
import { MantineProvider, ColorSchemeScript, createTheme, Button } from '@mantine/core';
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: 'relatle',
  description: 'In as few guesses as you can, use related artists to complete the artist path of the day! Like WikiRaces but with musicians.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={{
          fontFamily: 'OpenSauceOne',
        }} defaultColorScheme="dark">{children}</MantineProvider>
        <Analytics/>
      </body>
    </html>
  );
}