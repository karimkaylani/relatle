import Leaderboard from "../components/Leaderboard";
import Web from "../../public/data/web.json";
import { Suspense } from "react";

export const metadata = {
  title: "relatle (leaderboard)",
};

export default async function Home() {
  return (
    <Leaderboard web={Web}/>
  );
}