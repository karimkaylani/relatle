import Web from "../../public/data/web.json";
import Matchups from "../../public/data/matchups.json";
import PastDailyGames from "../components/PastDailyGames";

export const metadata = {
  title: "relatle (archive)",
  description: "Browse and play past daily games!",
};

export default async function Home() {
  return (
    <PastDailyGames web={Web} matchups={Matchups} />
  );
}
