import { Button, CopyButton } from "@mantine/core";
import { IconCopy, IconShare2 } from "@tabler/icons-react";
import React from "react";
import OutlineButton from "./OutlineButton";
import { white } from "../colors";

export interface ShareButtonProps {
  shareText: string;
  disabled?: boolean;
  buttonText: string;
  color: string;
  borderColor?: string;
  textColor?: string;
}

const ShareButton = ({
  disabled = false,
  shareText,
  buttonText,
  color,
  borderColor=color,
  textColor=color
}: ShareButtonProps) => {
  if (navigator.share) {
    return (
      <OutlineButton
        disabled={disabled}
        text={`Share ${buttonText}`}
        color={white}
        onClick={() => navigator.share({ text: shareText })}
        icon={<IconShare2 color={!disabled ? textColor : undefined}/>}
      />
    );
  }

  return (
    <CopyButton value={shareText}>
      {({ copied, copy }) => (
        <OutlineButton
          disabled={disabled}
          text={copied ? `Copied ${buttonText}!` : `Copy ${buttonText}`}
          color={white}
          onClick={copy}
          icon={<IconCopy color={!disabled ? textColor : undefined}/>}
      />
      )}
    </CopyButton>
  );
};

export default ShareButton;
