"use server";
import { createClient } from "@/utils/supabase/server";
import { unstable_cache } from "next/cache";

const getAllGuesses = async (matchupID: number): Promise<number[]> => {
  const supabase = createClient();
  console.log("Fetching guesses for matchup", matchupID);
  const { data, error } = await supabase
    .from("scores")
    .select("guesses")
    .eq("matchup_id", matchupID);
  if (error) {
    console.error(error);
    return [];
  }
  // Convert to list of guesses
  return data?.map((d: any) => d.guesses);
};

export const getCachedGuesses = unstable_cache(
  async (matchupID: number): Promise<number[] | null> =>
    getAllGuesses(matchupID),
  ['guesses'],
  { tags: ["guesses"], revalidate: 300 }
);
