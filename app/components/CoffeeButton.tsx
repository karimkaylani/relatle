import React from 'react'
import HoverButton from './HoverButton'
import { Card, Group, Text } from '@mantine/core'
import { IconCoffee } from '@tabler/icons-react'

const CoffeeButton = () => {
  return (
    <HoverButton onTap={() => window.open('https://www.buymeacoffee.com/karimk', '_blank')}>
        <Card shadow="md" radius="lg"
        p="xs">
            <Group gap="4px" justify='center'>
                <IconCoffee size={16}/>
                <Text size="sm" c="gray.1">BUY US A COFFEE</Text>
            </Group>
        </Card>
    </HoverButton>
  )
}

export default CoffeeButton