import { Card, Group, Text, Image } from '@mantine/core'
import React from 'react'
import HoverButton from './HoverButton'
import { phoneMaxWidth } from './Game'

export interface CustomGameModalProps { 
    customModalOpen: () => void
}

const CustomGameButton = (props: CustomGameModalProps) => {
    const {customModalOpen} = props
   
  return (
    <HoverButton onTap={() => customModalOpen()}>
        <Card shadow="md" radius="lg" p="sm">
            <Group gap="sm" justify='center'>
                <Image src={"custom-icon.svg"}/>
                <Text size={window.innerWidth > phoneMaxWidth ? "md" : "sm"} c="gray.1">CUSTOM GAME</Text>
            </Group>
        </Card>
    </HoverButton>
  )
}

export default CustomGameButton