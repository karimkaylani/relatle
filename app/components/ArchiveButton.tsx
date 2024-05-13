import { IconHistory } from '@tabler/icons-react'
import React from 'react'
import { white } from '../colors'
import { maxCustomTextWidth } from './Game'
import IconHoverButton from './IconHoverButton'

export interface ArchiveButtonProps {
    showText?: boolean;
    text?: string;
}

const ArchiveButton = ({showText=true, text='Archive'}: ArchiveButtonProps) => {
  return (
    <IconHoverButton onTap={() => window.open('/archive', '_self')} icon={<IconHistory color={white} size={18} />} showText={showText} text={text} />
  )
}

export default ArchiveButton