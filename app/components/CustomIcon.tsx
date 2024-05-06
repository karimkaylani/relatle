import { IconSparkles } from '@tabler/icons-react'
import React from 'react'
import { white } from '../colors';

export interface CustomIconProps {
    size?: number;
    label?: string|undefined;
    color?: string;
    filled?: boolean;
}

const CustomIcon = (props: CustomIconProps) => {
    const { size=18, label=undefined, color=white, filled=true } = props;
  return (
    <IconSparkles size={size} aria-label={label} fill={filled ? color : undefined} color={color} stroke={1} />
  )
}

export default CustomIcon