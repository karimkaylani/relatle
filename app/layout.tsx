// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "./globals.css"
import '@mantine/core/styles.css';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

export const metadata = {
  title: 'relatle',
  description: 'Get from one musician to another using their related artists!',
  url: "https://relatle.io",
  siteName: "relatle",
  metadataBase: new URL('https://relatle.io')
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <div className="container">
          <Script async src="https://www.googletagmanager.com/gtag/js?id=G-J23EFVPLCJ"/>
          <Script id="google-analytics">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', 'G-J23EFVPLCJ');
            `}
          </Script>
        </div>
      </head>
      <body>
        <MantineProvider theme={{
          fontFamily: 'OpenSauceOne',
          fontSizes: {
            xs: "0.625rem",
            sm: "0.75rem",
            md: "0.875rem",
            lg: "1.125rem",
            xl: "1.25rem",
          },
        }} defaultColorScheme="dark">
          {children}
        </MantineProvider>
        <Analytics/>
      </body>
    </html>
  );
}