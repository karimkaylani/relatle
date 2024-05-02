'use client'
import { createClient } from "@/utils/supabase/client";
import { Stats } from "./components/GameOver";

export const getStats = async (matchup: string[], shortestPath: number): Promise<Stats | null> => {
  const supabase = createClient();
  console.log("Fetching guesses for matchup", matchup);
  let { data, error } = await supabase
    .from("scores")
    .select("guesses")
    .eq("matchup", JSON.stringify(matchup));
  if (error) {
    console.error(error);
    return null;
  }
  // Convert to list of guesses
  let guesses = data?.map((d: any) => d.guesses) ?? [];

  let { data: customData, error: customError } = await supabase
    .from("custom_game_scores")
    .select("guesses, won")
    .eq("matchup", JSON.stringify(matchup));
  if (customError) {
    console.error(customError);
    return null;
  }
  // get guesses for custom games with won = true
  let customGuesses = customData?.filter((d: any) => d.won).map((d: any) => d.guesses) ?? [];
  guesses = guesses.concat(customGuesses);

  if (guesses.length < 3) {
    return null;
  }

  // count number of games with won = false
  let numCustomLost = customData?.filter((d: any) => !d.won).length ?? 0;

  const averageScore = guesses.reduce((a: number, b: number) => a + b, 0) / guesses.length;

  let { data: givenUpData, error: givenUpError } = await supabase
    .from("give_up_scores")
    .select("guesses")
    .eq("matchup", JSON.stringify(matchup));
  if (givenUpError) {
    console.error(givenUpError);
    return null;
  }
  let numGivenUp = givenUpData?.length ?? 0;
  const numLost = numCustomLost + numGivenUp;
  const numWon = guesses.length;
  const numGames = numWon + numLost;
  const perfectGames = guesses.filter((g: number) => g === shortestPath).length;
  const perfectGameRate = (perfectGames / numGames) * 100;
  const winRate = (numWon / numGames) * 100;
  
  const binSize = 5;
  const numBins = 5;  
  let binsRange = [];

  let curr = shortestPath
  for (let i = 0; i < numBins - 1; i++) {
    let next = curr + (binSize - 1);
    binsRange.push([curr, next]);
    curr = next + 1;
  }
  binsRange.push([curr, Infinity]);

  const getKey = (b: number[]) => {
    if (b[1] === Infinity) {
      return b[0] + "+";
    }
    return b[0] + "-" + b[1];
  }

  let bins: { [key: string]: number } = {};
  for (let b of binsRange) {
    bins[getKey(b)] = 0;
  }

  for (let g of guesses) {
    for (let b of binsRange) {
      if (g >= b[0] && g <= b[1]) {
        let key = getKey(b);
        bins[key] += 1;
      }
    }
  }
  for (let key of Object.keys(bins)) {
    bins[key] = (bins[key] / numGames) * 100;
  }
  return {
    averageScore,
    numGames,
    perfectGameRate,
    winRate,
    bins,
  };
};
