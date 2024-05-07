import { alpha, Button, darken } from "@mantine/core";
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
  filled?: boolean;
  size?: string;
  showText?: boolean;
}

const RelatleButton = ({
  text,
  color,
  textColor=color,
  borderColor=color,
  disabled = false,
  loading = false,
  filled = false,
  size='md',
  onClick,
  icon = undefined,
  showText = true,
}: RelatleButtonProps) => {
  if (color === white) {
    borderColor = gray6;
    color = gray5;
  }
  return (
    <Button
      disabled={disabled}
      loading={loading}
      leftSection={showText && icon}
      radius={8}
      variant={filled ? "white" : "light"}
      color={color}
      size={size}
      onClick={onClick}
      styles={{
        label: { fontSize: "14px", color: !disabled ? textColor : undefined },
        section: { marginRight: "8px" },
        root: {
          border: !disabled ? `2px solid ${alpha(borderColor, 0.5)}` : undefined,
          minHeight: size === 'md' ? "45px" : size === 'sm' ? "40px" : undefined,
        },
      }}
    >
      {showText && text}
      {!showText && icon}
    </Button>
  );
};

export default RelatleButton;
