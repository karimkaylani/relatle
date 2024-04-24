import { Button, CopyButton } from "@mantine/core";
import { IconCopy, IconShare2 } from "@tabler/icons-react";
import React from "react";
import OutlineButton from "./OutlineButton";

export interface ShareButtonProps {
  shareText: string;
  disabled?: boolean;
  buttonText: string;
  color: string;
  borderColor?: string;
}

const ShareButton = ({
  disabled = false,
  shareText,
  buttonText,
  color,
  borderColor=color
}: ShareButtonProps) => {
  if (navigator.share) {
    return (
      <OutlineButton
        disabled={disabled}
        text={`Share ${buttonText}`}
        color={color}
        onClick={() => navigator.share({ text: shareText })}
        icon={<IconShare2 />}
        borderColor={borderColor}
      />
    );
  }

  return (
    <CopyButton value={shareText}>
      {({ copied, copy }) => (
        <OutlineButton
          disabled={false}
          text={copied ? `Copied ${buttonText}!` : `Copy ${buttonText}`}
          color={color}
          onClick={copy}
          icon={<IconCopy />}
          borderColor={borderColor}
      />
      )}
    </CopyButton>
  );
};

export default ShareButton;
