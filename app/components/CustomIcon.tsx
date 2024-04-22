import { IconSparkles } from '@tabler/icons-react'
import React from 'react'

export interface CustomIconProps {
    size?: number;
    label?: string|undefined;
}

const CustomIcon = (props: CustomIconProps) => {
    const { size=18, label=undefined } = props;
  return (
    <IconSparkles size={size} aria-label={label} fill='white' color='white' stroke={1} />
  )
}

export default CustomIcon