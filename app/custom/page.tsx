import Script from "next/script";
import Game from "../components/Game";
import { Suspense } from "react";
import Web from "../web.json";

export const metadata = {
  title: "relatle (custom game)",
};

export default async function Home() {
  return (
    <main>
      <Suspense>
        <div className="container">
          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-J23EFVPLCJ"
          />
          <Script id="google-analytics">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
              
                gtag('config', 'G-J23EFVPLCJ');
              `}
          </Script>
        </div>
        <Game web={Web} matchups={null} is_custom={true} />
      </Suspense>
    </main>
  );
}
