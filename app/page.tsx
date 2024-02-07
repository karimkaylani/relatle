'use server'
import { promises as fs } from 'fs';
import Game, { Artist } from './components/Game';
import Script from 'next/script';
import { Suspense, cache } from 'react';

export default async function Home() {
  const web = await getWeb()
  const matchups = await getMatchups()
  return (
    <main>
      <Suspense>
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
        <Game web={web} matchups={matchups} is_custom={false}/>
      </Suspense>
    </main>
  )
}

export async function getWeb(): Promise<{[key: string]: Artist}> {
  const web = await fs.readFile(process.cwd() + "/public/web.json", "utf8")
  return JSON.parse(web)
}

async function getMatchups(): Promise<string[][]> {
  const matchups = await fs.readFile(process.cwd() + "/public/matchups.json", "utf8")
  const data = JSON.parse(matchups)
  return data
}