import TopCustomGames from "../components/TopCustomGames";
import Web from "../../public/data/web.json";

export const metadata = {
  title: "relatle (top games)",
  description: "Browse and play the most popular custom games!"
};

export default async function Home() {
  return (
    <TopCustomGames web={Web}/>
  );
}
