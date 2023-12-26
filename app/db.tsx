'use server'
import { sql } from '@vercel/postgres';
import { unstable_cache, revalidateTag } from 'next/cache';



export async function addScoreToDB(matchup: string[], matchupID: number, guesses: number, resets:number, path: string[], usedHint: boolean) {
    const date = new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"})
    try {
      await sql`INSERT INTO scores (timestamp, matchup, matchup_id, guesses, resets, path, used_hint) VALUES
       (${date}, ${JSON.stringify(matchup)}, ${matchupID}, ${guesses}, ${resets}, ${JSON.stringify(path)}, ${usedHint})`
       revalidateTag('scores')
    }
    catch {
      console.error("Error adding score to DB")
    }
  }

export const getCachedAverageMinGuesses = unstable_cache(
  async (matchupID: number): Promise<number[]|null> => getAverageMinGuesses(matchupID),
  undefined, {tags: ['scores'], revalidate: 600})

  export async function getAverageMinGuesses(matchupID: number): Promise<number[]|null> {
    try {
      const { rows } = await sql`SELECT AVG(guesses) AS avg_guesses, MIN(guesses) AS min_guesses,
      COUNT(guesses) AS count_guesses FROM scores WHERE matchup_id=${matchupID}`
      return rows[0].count_guesses > 2 ? [rows[0].avg_guesses, rows[0].min_guesses] : null
    }
    catch {
      console.error("Error getting average score")
      return null
    }
  }