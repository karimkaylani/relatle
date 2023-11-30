// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "./globals.css"
import '@mantine/core/styles.css';
import { MantineProvider, ColorSchemeScript, createTheme, Button } from '@mantine/core';

export const metadata = {
  title: 'Relatle',
  description: 'Relatle Description',
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
      </body>
    </html>
  );
}