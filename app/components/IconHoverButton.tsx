import React, { ReactNode } from 'react'
import HoverButton from './HoverButton';
import { Anchor, Button, Card, Group, Image, Text } from '@mantine/core';
import { phoneMaxWidth } from './Game';
import { green, white } from '../colors';

export interface IconHoverButtonProps {
    onTap: () => void;
    icon: ReactNode;
    text: string;
    textSize?: string;
    showText?: boolean;
    textColor?: string;
  }

const IconHoverButton = (props: IconHoverButtonProps) => {
  const { onTap, icon, text, textSize=window.innerWidth > phoneMaxWidth ? "md" : "sm", showText=true, textColor=white } = props;
  return (
      <HoverButton onTap={onTap}>
        <Card shadow="md" radius="lg" p={showText ? "sm" : "xs"}>
        <Group gap="6px" justify="center" wrap='nowrap'>
          {icon}
          {showText &&
            <Text
              fw={700}
              size={textSize}
              c={textColor}
              truncate='end'
            >
              {text}
            </Text>}
        </Group>
      </Card>
    </HoverButton>
  )
}

export default IconHoverButton