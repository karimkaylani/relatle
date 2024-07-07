'use server'

import { createClient } from "@/utils/supabase/client";

export interface Stats {
  averageScore: number;
  numGames: number;
  perfectGameRate: number;
  winRate: number;
  bins: { [key: string]: number };
}

export const getStats = async (matchup: string[], shortestPath: number): Promise<Stats | null> => {
  const supabase = createClient();
  // call get_stats postgres function
  let { data, error } = await supabase.rpc("get_stats", { curr_matchup: JSON.stringify(matchup), shortest_path: shortestPath });
  if (error) {
    console.error(error);
    return null;
  }
  const { average_score, num_games, perfect_game_rate, win_rate, won_guesses } = data[0];
  if (num_games === null || num_games < 3 || average_score === null || perfect_game_rate === null || win_rate === null) {
    return null;
  }
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

  for (let g of won_guesses) {
    for (let b of binsRange) {
      if (g >= b[0] && g <= b[1]) {
        let key = getKey(b);
        bins[key] += 1;
      }
    }
  }
  for (let key of Object.keys(bins)) {
    bins[key] = (bins[key] / won_guesses.length) * 100;
  }
  return {
    averageScore: average_score,
    numGames: num_games,
    perfectGameRate: perfect_game_rate,
    winRate: win_rate,
    bins,
  };
};

export interface CustomGame {
  matchup: string[];
  numGames: number;
  averageScore: number;
  winRate: number;
}

export const getLeaderboard = async(amount: number, start_pos: number): Promise<CustomGame[] | null> => {
  const supabase = createClient();
  let { data, error } = await supabase.rpc("get_leaderboard", { amount: amount, start_position: start_pos});
  if (error) {
    console.error(error);
    return null;
  }
  let res = data.map((row: any) => {
    return {
      matchup: JSON.parse(row.matchup),
      numGames: row.num_plays,
      averageScore: row.average_guesses,
      winRate: row.win_percentage,
    };
  });
  return res;
}