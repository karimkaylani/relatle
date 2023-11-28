import { promises as fs } from 'fs';
import Game, { Artist } from './components/Game';

export default async function Home() {
  const web = await getWeb()
  const matchup = await getMatchup()
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
  
  // return data[getRandomInt(0, data.length - 1)]
  const startDate = new Date("2023-11-27")
  const index = getNumDaysDifferenceFromToday(startDate) % data.length
  return data[index]  
}

function getNumDaysDifferenceFromToday(startDate: Date) {
  const today = new Date();
  const oneDay = (1000 * 3600 * 24);
  const diff = Math.round((today.getTime() - startDate.getTime()) / oneDay);
  return diff
}

// For testing purposes
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}