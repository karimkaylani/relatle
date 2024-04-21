import React, { ReactNode } from 'react'
import HoverButton from './HoverButton';
import { Anchor, Button, Card, Group, Image, Text } from '@mantine/core';
import { phoneMaxWidth } from './Game';

export interface IconHoverButtonProps {
    onTap: () => void;
    icon: ReactNode;
    text: string;
    textSize?: string;
    url?: string;
  }

const IconHoverButton = (props: IconHoverButtonProps) => {
  const { onTap, icon, text, textSize=window.innerWidth > phoneMaxWidth ? "md" : "sm", url=undefined } = props;
  return (
      <HoverButton onTap={onTap}>
        <Anchor href={url} underline='never' target='_blank'>
        <Card shadow="md" radius="lg" p="sm">
        <Group gap="sm" justify="center">
          {icon}
            <Text
              fw={700}
              size={textSize}
              c="gray.1"
            >
              {text}
            </Text>
        </Group>
      </Card>
      </Anchor>
    </HoverButton>
  )
}

export default IconHoverButton