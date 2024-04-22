import React from "react";
import CustomIcon from "./CustomIcon";
import IconHoverButton from "./IconHoverButton";

export interface CustomGameModalProps {
  customModalOpen: () => void;
  showText?: boolean;
}

const CustomGameButton = (props: CustomGameModalProps) => {
  const { customModalOpen, showText = true } = props;

  return (
    <IconHoverButton
      onTap={customModalOpen}
      icon={<CustomIcon size={18} label={"Custom Game"} />}
      text="Custom Game"
      showText={showText}
    />
  );
};

export default CustomGameButton;
