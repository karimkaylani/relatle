import { Button, CopyButton } from "@mantine/core";
import { IconCopy, IconShare2 } from "@tabler/icons-react";
import React from "react";
import RelatleButton from "./RelatleButton";
import { white } from "../colors";
import { phoneMaxWidth, watermarkWidth } from "./Game";

export interface ShareButtonProps {
  shareText: string;
  disabled?: boolean;
  buttonText: string;
  color: string;
  borderColor?: string;
  textColor?: string;
  size?: string;
  copy?: boolean;
}

const ShareButton = ({
  disabled = false,
  shareText,
  buttonText,
  color,
  size = "md",
  copy = false,
}: ShareButtonProps) => {
  if (
    !copy &&
    window.innerWidth < phoneMaxWidth &&
    navigator.share &&
    navigator.canShare &&
    navigator.canShare({ text: shareText })
  ) {
    return (
      <RelatleButton
        disabled={disabled}
        text={`Share ${buttonText}`}
        color={color}
        onClick={() => navigator.share({ text: shareText })}
        icon={<IconShare2 color={!disabled ? color : undefined} />}
        size={size}
      />
    );
  }

  return (
    <CopyButton value={shareText}>
      {({ copied, copy }) => (
        <RelatleButton
          disabled={disabled}
          text={copied ? `Copied ${buttonText}!` : `Copy ${buttonText}`}
          color={color}
          onClick={copy}
          icon={<IconCopy color={!disabled ? color : undefined} />}
          size={size}
        />
      )}
    </CopyButton>
  );
};

export default ShareButton;
