import { promises as fs } from 'fs';

export default async function Home() {
  const web = await getWeb()
  const matchup = await getMatchup()
  return (
    <main>
      <h1>relatle</h1>
      <h2>{`${matchup[0]} => ${matchup[1]}`}</h2>
      <ul>
        {}
      </ul>
    </main>
  )
}

export async function getWeb() {
  const web = await fs.readFile(process.cwd() + "/public/web.json", "utf8")
  return JSON.parse(web)
}

export async function getMatchup() {
  const matchups = await fs.readFile(process.cwd() + "/public/matchups.json", "utf8")
  const data = JSON.parse(matchups)
  return data[getRandomInt(0, data.length - 1)]
}

// For testing purposes
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}