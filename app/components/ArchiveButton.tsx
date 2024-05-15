import { IconHistory } from "@tabler/icons-react";
import React from "react";
import { white } from "../colors";
import { maxCustomTextWidth } from "./Game";
import IconHoverButton from "./IconHoverButton";
import { useRouter } from "next/navigation";

export interface ArchiveButtonProps {
  showText?: boolean;
  text?: string;
}

const ArchiveButton = ({
  showText = true,
  text = "Archive",
}: ArchiveButtonProps) => {
  const router = useRouter();
  return (
    <IconHoverButton
      onTap={() => router.push("/archive")}
      icon={<IconHistory color={white} size={24} />}
      showText={showText}
      text={text}
    />
  );
};

export default ArchiveButton;
