import { Card, Group, Text, Image } from '@mantine/core'
import React from 'react'
import HoverButton from './HoverButton'
import { phoneMaxWidth } from './Game'

interface CustomGameButtonProps {
    visible: boolean
}

const CustomGameButton = (props: CustomGameButtonProps) => {
    const visible = props.visible
  return (
    // <HoverButton>
        <Card shadow="md" radius="lg"
        p="sm" styles={{root: {opacity: visible ? 100 : 0}}}>
            <Group gap="sm" justify='center'>
                <Image src={"custom-icon.svg"}/>
                <Text size={window.innerWidth > phoneMaxWidth ? "md" : "sm"} c="gray.1">CUSTOM GAME</Text>
            </Group>
        </Card>
    // </HoverButton>
  )
}

export default CustomGameButton