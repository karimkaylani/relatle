import React from "react";
import { phoneMaxWidth } from "./Game";
import { motion } from "framer-motion";

export interface HoverButtonProps {
  onTap: () => void;
  children: any;
  onKeyDown?: () => void;
}

const HoverButton = (props: HoverButtonProps) => {
  const { onTap, children, onKeyDown=onTap } = props;
  return (
    <motion.button
      whileHover={
        window.innerWidth > phoneMaxWidth ? { scale: 1.05 } : { scale: 1.03 }
      }
      whileTap={{ scale: 0.95 }}
      onTap={onTap}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onKeyDown();
        }
      }}
    >
      {children}
    </motion.button>
  );
};

export default HoverButton;
