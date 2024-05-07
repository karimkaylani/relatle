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
  // onTap breaks for drawers/modals, will trigger on scroll
  // So use Card onClick instead, but still expose onKeyDown for keyboard support
  return (
      <HoverButton onTap={() => {}} onKeyDown={onTap}>
        <Card onClick={onTap} shadow="md" radius="lg" p="sm">
        <Group gap="6px" justify="center">
          {icon}
          {showText &&
            <Text
              fw={700}
              size={textSize}
              c={textColor}
            >
              {text}
            </Text>}
        </Group>
      </Card>
    </HoverButton>
  )
}

export default IconHoverButton