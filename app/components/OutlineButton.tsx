import { Button } from '@mantine/core';
import React from 'react'

export interface OutlineButtonProps {
    text: string;
    color: string;
    onClick: () => void;
    icon?: React.ReactNode;
}

const OutlineButton = ({text, color, onClick, icon=undefined}: OutlineButtonProps) => {
  return (
    <Button
        leftSection={icon}
        radius={8}
        variant="outline"
        color={color}
        size="md"
        h={45}
        onClick={onClick}
        styles={{label: {fontSize: '14px'}, section: {marginRight: "8px"}}}
      >
        {text}
      </Button>
  )
}

export default OutlineButton