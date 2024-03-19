"use server";
import Game from "./components/Game";
import Script from "next/script";
import { Suspense } from "react";

export default async function Home() {
  const webReq = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/data/web.json`, { cache: "no-store"});
  const matchupsReq = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/data/matchups.json`, { cache: "no-store"});
  const Web = await webReq.json();
  const Matchups = await matchupsReq.json();
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
