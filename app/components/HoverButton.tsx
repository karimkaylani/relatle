import React from "react";
import { phoneMaxWidth } from "./Game";
import { motion } from "framer-motion";
import { Box } from "@mantine/core";

export interface HoverButtonProps {
  onTap: () => void;
  children: any;
  clickable?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onKeyUp?: (e: React.KeyboardEvent) => void;
}

const HoverButton = (props: HoverButtonProps) => {
  const defOnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      props.onTap();
    }
  }
  const { onTap, children, clickable=true, onKeyDown=defOnKeyDown, onKeyUp=() => {} } = props;
   // onTap breaks for drawers/modals, will trigger on scroll
  // So use Box onClick instead, but still expose onKeyDown for keyboard support
  return (
    <motion.button
    whileHover={
      clickable
        ? window.innerWidth > phoneMaxWidth
          ? { scale: 1.05 }
          : { scale: 1.03 }
        : {}
    }
      whileTap={{ scale: 0.95 }}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
>
      <Box onClick={onTap}>{children}</Box>
    </motion.button>
  );
};

export default HoverButton;
