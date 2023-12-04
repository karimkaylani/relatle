import React from 'react'
import { phoneMaxWidth } from './Game'
import { motion } from 'framer-motion'

export interface HoverButtonProps {
    onTap: () => void,
    children: any
}

const HoverButton = (props: HoverButtonProps) => {
    const {onTap, children} = props
  return (
    <motion.button
        whileHover={window.innerWidth > phoneMaxWidth ? { scale: 1.05 } : {scale: 1.03}}
        whileTap={{ scale: 0.95 }}
        onTap={() => onTap()}>
        {children}
    </motion.button>
  )
}

export default HoverButton