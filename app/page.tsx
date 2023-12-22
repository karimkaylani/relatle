'use server'
import { promises as fs } from 'fs';
import Game, { Artist } from './components/Game';
import Script from 'next/script';
import { Suspense } from 'react';
import { sql } from '@vercel/postgres';

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

export async function addScoreToDB(matchup: string[], matchupID: number, guesses: number, resets:number, path: string[], usedHint: boolean) {
  const date = new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"})
  try {
    await sql`INSERT INTO scores (timestamp, matchup, matchup_id, guesses, resets, path, used_hint) VALUES
     (${date}, ${JSON.stringify(matchup)}, ${matchupID}, ${guesses}, ${resets}, ${JSON.stringify(path)}, ${usedHint})`
  }
  catch {
    console.error("Error adding score to DB")
  }
}

export async function getAverageScore(matchupID: number) {
  try {
    const res = await sql`SELECT AVG(guesses) AS avg_guesses, AVG(resets) AS avg_resets FROM scores WHERE matchup_id=${matchupID}`
    return res
  }
  catch {
    console.error("Error getting average score")
    return null
  }
  
}

export async function getWeb(): Promise<{[key: string]: Artist}> {
  const web = await fs.readFile(process.cwd() + "/public/web.json", "utf8")
  return JSON.parse(web)
}

async function getMatchups(): Promise<{[key: string]: string[]}> {
  const matchups = await fs.readFile(process.cwd() + "/public/matchups.json", "utf8")
  const data = JSON.parse(matchups)
  return data
}