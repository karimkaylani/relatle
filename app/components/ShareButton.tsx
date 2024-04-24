import { Button, CopyButton } from "@mantine/core";
import { IconCopy, IconShare2 } from "@tabler/icons-react";
import React from "react";
import RelatleButton from "./RelatleButton";
import { white } from "../colors";

export interface ShareButtonProps {
  shareText: string;
  disabled?: boolean;
  buttonText: string;
  color: string;
  borderColor?: string;
  textColor?: string;
  size?: string;
}

const ShareButton = ({
  disabled = false,
  shareText,
  buttonText,
  color,
  size='md'
}: ShareButtonProps) => {
  if (navigator.share) {
    return (
      <RelatleButton
        disabled={disabled}
        text={`Share ${buttonText}`}
        color={color}
        onClick={() => navigator.share({ text: shareText })}
        icon={<IconShare2 color={!disabled ? color : undefined}/>}
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
          icon={<IconCopy color={!disabled ? color : undefined}/>}
          size={size}
      />
      )}
    </CopyButton>
  );
};

export default ShareButton;
