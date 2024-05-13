import React from 'react'
import IconHoverButton from './IconHoverButton'
import { IconTrophy } from '@tabler/icons-react'
import { maxCustomTextWidth } from './Game'
import { white } from '../colors'

export interface TopGamesButtonProps {
    showText?: boolean;
    text?: string;
}

const TopGamesButton = ({showText=true, text='Top Games'}: TopGamesButtonProps) => {
  return (
    <IconHoverButton onTap={() => window.open('top-games', '_self')} icon={<IconTrophy color={white} size={18} />} showText={showText} text={text} />
  )
}

export default TopGamesButton