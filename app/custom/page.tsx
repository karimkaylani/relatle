import Game from "../components/Game";
import Web from "../../public/data/web.json";

export const metadata = {
  title: "relatle (custom game)",
};

export default async function Home() {
  return (
    <Game web={Web} is_custom={true} />
  );
}
