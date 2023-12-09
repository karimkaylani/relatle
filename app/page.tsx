import { promises as fs } from 'fs';
import Game, { Artist } from './components/Game';

export default async function Home() {
  const web = await getWeb()
  const matchups = await getMatchups()
  return (
    <main>
      <Game web={web} matchups={matchups} is_custom={false}/>
    </main>
  )
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