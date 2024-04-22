import React from "react";
import HoverButton from "./HoverButton";

export interface ClickableIconProps {
    url?: string;
    icon: React.ReactNode;
}

const ClickableIcon = ({url, icon}: ClickableIconProps) => {
  return (
    <a
      tabIndex={-1}
      className="mt-1"
      href={url}
      target="_blank"
    >
      <HoverButton
        onTap={() => {
          return;
        }}
      >
        {icon}
      </HoverButton>
    </a>
  );
};

export default ClickableIcon;
