import React from "react";
import ShareButton from "./ShareButton";
import { gray9, gray7, white, gray6 } from "../colors";

export interface ShareCustomGameProps {
  start: string;
  end: string;
  disabled: boolean;
}

export const generateCustomGameURL = (start: string, end: string): string => {
  return `${process.env.NEXT_PUBLIC_BASE_URL}/custom?start=${encodeURIComponent(
    start
  )}&end=${encodeURIComponent(end)}`;
};

const ShareCustomGame = (props: ShareCustomGameProps) => {
  const { start, end, disabled } = props;
  const url = generateCustomGameURL(start, end);

  return (
    <ShareButton
      disabled={disabled}
      shareText={url}
      buttonText="Link"
      color={white}
      borderColor={gray6}
    />
  );
};

export default ShareCustomGame;
