import { Button, darken } from "@mantine/core";
import React from "react";
import { dk_yellow, gray5, gray6, gray7, white } from "../colors";

export interface RelatleButtonProps {
  text: string;
  color: string;
  textColor?: string;
  borderColor?: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  size?: string;
}

const RelatleButton = ({
  text,
  color,
  textColor=color,
  borderColor=color,
  disabled = false,
  loading = false,
  size='md',
  onClick,
  icon = undefined,
}: RelatleButtonProps) => {
  if (color === white) {
    borderColor = gray6;
    textColor = white;
    color = gray5;
  }
  return (
    <Button
      disabled={disabled}
      loading={loading}
      leftSection={icon}
      radius={8}
      variant="light"
      color={color}
      size={size}
      onClick={onClick}
      styles={{
        label: { fontSize: "14px", color: !disabled ? textColor : undefined },
        section: { marginRight: "8px" },
        root: {
          border: !disabled ? `2px solid ${borderColor}` : undefined,
          minHeight: size === 'md' ? "45px" : undefined,
        },
      }}
    >
      {text}
    </Button>
  );
};

export default RelatleButton;
