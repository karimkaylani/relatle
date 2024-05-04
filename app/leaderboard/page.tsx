import Leaderboard from "../components/Leaderboard";
import Web from "../../public/data/web.json";

export const metadata = {
  title: "relatle (custom game)",
};

export default async function Home() {
  return (
    <Leaderboard web={Web}/>
  );
}
