import TopCustomGames, { totalAmount } from "../components/TopCustomGames";
import Web from "../../public/data/web.json";
import { getLeaderboard } from "../db";

export const metadata = {
  title: "relatle (top games)",
  description: "Browse and play the most popular custom games!"
};

export default async function Home() {
  const top_games = await getLeaderboard(totalAmount, 1) ?? []
  return (
    <TopCustomGames web={Web} top_games={top_games}/>
  );
}
