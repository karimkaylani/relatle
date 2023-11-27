import { promises as fs } from 'fs';
import Game, { Artist } from './components/Game';

export default async function Home() {
  const web = await getWeb()
  const matchup = await getMatchup()
  const [start, end] = matchup
  return (
    <main>
      <h1>relatle</h1>
      <Game web={web} matchup={matchup}/>
    </main>
  )
}

export async function getWeb(): Promise<{[key: string]: Artist}> {
  const web = await fs.readFile(process.cwd() + "/public/web.json", "utf8")
  return JSON.parse(web)
}

export async function getMatchup(): Promise<string[]> {
  const matchups = await fs.readFile(process.cwd() + "/public/matchups.json", "utf8")
  const data = JSON.parse(matchups)
  return data[getRandomInt(0, data.length - 1)]
}

// For testing purposes
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}