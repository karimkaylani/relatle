import React from "react";
import IconHoverButton from "./IconHoverButton";
import { IconTrophy } from "@tabler/icons-react";
import { maxCustomTextWidth } from "./Game";
import { white } from "../colors";
import { useRouter } from "next/navigation";

export interface TopGamesButtonProps {
  showText?: boolean;
  text?: string;
}

const TopGamesButton = ({
  showText = true,
  text = "Top Games",
}: TopGamesButtonProps) => {
  const router = useRouter();
  return (
    <IconHoverButton
      onTap={() => router.push("top-games")}
      icon={<IconTrophy color={white} size={24} />}
      showText={showText}
      text={text}
    />
  );
};

export default TopGamesButton;
