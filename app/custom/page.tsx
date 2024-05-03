import Game from "../components/Game";
import Web from "../../public/data/web.json";
import Matchups from "../../public/data/matchups.json";
import { Suspense } from "react";

export const metadata = {
  title: "relatle (custom game)",
};

export default async function Home() {
  return (
    <Suspense>
      <Game web={Web} matchups={Matchups} is_custom={true} />
    </Suspense>
  );
}
