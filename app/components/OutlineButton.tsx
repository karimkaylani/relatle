import { Button, darken } from "@mantine/core";
import React from "react";
import { dk_yellow, gray6, gray7 } from "../colors";

export interface OutlineButtonProps {
  text: string;
  color: string;
  textColor?: string;
  borderColor?: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const OutlineButton = ({
  text,
  color,
  textColor=color,
  borderColor=color,
  disabled = false,
  onClick,
  icon = undefined,
}: OutlineButtonProps) => {
  return (
    <Button
      disabled={disabled}
      leftSection={icon}
      radius={8}
      variant="light"
      color={color}
      size="md"
      onClick={onClick}
      styles={{
        label: { fontSize: "14px", color: !disabled ? textColor : undefined },
        section: { marginRight: "8px" },
        root: {
          border: !disabled ? `2px solid ${borderColor}` : undefined,
          minHeight: "45px",
        },
      }}
    >
      {text}
    </Button>
  );
};

export default OutlineButton;
