import Game from "./components/Game";
import Web from "../public/data/web.json";
import Matchups from "../public/data/matchups.json";
import { Suspense } from "react";

export default async function Home() {
  return (
    <Suspense>
      <Game web={Web} matchups={Matchups} is_custom={false} />
    </Suspense>
  );
}
