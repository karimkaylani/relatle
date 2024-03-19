"use server";
import Game from "./components/Game";
import Web from "../public/data/web.json";
import Matchups from "../public/data/matchups.json";

export default async function Home() {
  return (
    <Game web={Web} matchups={Matchups} is_custom={false} />
  );
}
