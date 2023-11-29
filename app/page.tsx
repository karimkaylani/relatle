import { promises as fs } from 'fs';
import Game, { Artist } from './components/Game';

import { Inter } from 'next/font/google'
 
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })

export default async function Home() {
  const web = await getWeb()
  const matchups = await getMatchups()
  return (
    <main className={inter.className}>
      <Game web={web} matchups={matchups}/>
    </main>
  )
}

async function getWeb(): Promise<{[key: string]: Artist}> {
  const web = await fs.readFile(process.cwd() + "/public/web.json", "utf8")
  return JSON.parse(web)
}

async function getMatchups(): Promise<string[][]> {
  const matchups = await fs.readFile(process.cwd() + "/public/matchups.json", "utf8")
  const data = JSON.parse(matchups)
  return data
}