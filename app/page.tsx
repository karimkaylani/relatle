"use server";
import Game from "./components/Game";
import Script from "next/script";
import { Suspense } from "react";
import Web from "./web.json";
import Matchups from "./matchups.json";

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
        <Game web={Web} matchups={Matchups} is_custom={false} />
      </Suspense>
    </main>
  );
}
