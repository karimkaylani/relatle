'use server'
import { createClient } from "@/utils/supabase/server";

export const getAllGuesses = async (matchupID: number): Promise<any | null> => {
    const supabase = createClient();
    console.log("Fetching guesses for matchup", matchupID)
    const { data, error } = await supabase.from('scores').select('guesses').eq('matchup_id', matchupID)
    if (error) {
      console.error(error)
      return null
    }
    // Convert to list of guesses
    return data?.map((d: any) => d.guesses)
}