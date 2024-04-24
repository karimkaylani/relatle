import { IconSparkles } from '@tabler/icons-react'
import React from 'react'
import { white } from '../colors';

export interface CustomIconProps {
    size?: number;
    label?: string|undefined;
    color?: string;
}

const CustomIcon = (props: CustomIconProps) => {
    const { size=18, label=undefined, color=white } = props;
  return (
    <IconSparkles size={size} aria-label={label} fill={white} color={color} stroke={1} />
  )
}

export default CustomIcon