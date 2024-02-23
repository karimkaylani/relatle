'use server'
import { sql } from '@vercel/postgres';
import { unstable_cache, revalidateTag } from 'next/cache';



export async function addScoreToDB(matchup: string[], matchupID: number, guesses: number, resets:number, path: string[], usedHint: boolean) {
    const date = new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"})
    try {
      await sql`INSERT INTO scores (timestamp, matchup, matchup_id, guesses, resets, path, used_hint) VALUES
       (${date}, ${JSON.stringify(matchup)}, ${matchupID}, ${guesses}, ${resets}, ${JSON.stringify(path)}, ${usedHint})`
      // revalidateTag('guesses')
    }
    catch {
      console.error("Error adding score to DB")
    }
  }

export const getCachedGuesses = unstable_cache(
  async (matchupID: number): Promise<number[]|null> => getAllGuesses(matchupID),
  ['guesses'], {tags: ['guesses'], revalidate: 300}
)

export async function getAllGuesses(matchupID: number): Promise<number[]|null> {
  try {
    const { rows } = await sql`SELECT guesses FROM scores WHERE matchup_id=${matchupID}`
    const guesses = rows.map(row => row.guesses)
    return guesses
  }
  catch {
    console.error("Error getting all guesses")
    return null
  }
}