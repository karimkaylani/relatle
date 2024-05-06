import React from "react";
import CustomIcon from "./CustomIcon";
import IconHoverButton from "./IconHoverButton";

export interface CustomGameModalProps {
  customModalOpen: () => void;
  showText?: boolean;
  text?: string;
  color?: string;
}

const CustomGameButton = (props: CustomGameModalProps) => {
  const { customModalOpen, showText = true, text='Custom Game', color } = props;

  return (
    <IconHoverButton
      onTap={customModalOpen}
      icon={<CustomIcon size={18} label={text} />}
      text={text}
      showText={showText}
      bgColor={color}
    />
  );
};

export default CustomGameButton;
