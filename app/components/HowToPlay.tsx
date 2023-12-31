import { Modal, Text, Image, Group, Flex, Card, Stack } from '@mantine/core'
import React from 'react'
import HoverButton from './HoverButton';
import { Artist } from './Game';
import { IconHelpCircle } from '@tabler/icons-react'
import Matchup from './Matchup';

export interface HowToPlayProps {
    start: Artist,
    end: Artist,
    opened: boolean,
    handlers: any
}

const HowToPlay = (props: HowToPlayProps) => {
    const {start, end, opened, handlers} = props
    const {open, close} = handlers
  return (
    <Group justify="flex-end">
        <HoverButton onTap={open}>
            <IconHelpCircle size={24}/>
        </HoverButton>
        <Modal opened={opened} 
            onClose={close} withCloseButton={true} centered
            padding="xl" radius="lg" title="How to Play"
            styles={{ title: { fontSize: "24px", color: "#f1f3f5", fontWeight: 700, lineHeight: "32px" },
            header: {top: -1} }}>
            <Flex 
            align="left" direction="column" gap="lg">
                <Group wrap="nowrap">
                    <Card
                        shadow="sm" radius="md"
                        padding="5px" w={30}>
                        <Text ta="center">1</Text>
                    </Card>
                    <Text fw={300}>Identify the artist matchup of the day</Text>
                </Group>
                
                <Matchup start={start} end={end} small={true}/>

                <Group wrap="nowrap">
                    <Card shadow="sm" radius="md" padding="5px" w={50}>
                        <Text ta="center">2</Text>
                    </Card>
                    <Stack align='center' justify='center'>
                    <Text fw={300}>Continue to choose related artists that would get
                    you closer to the target artist. If you get stuck, you can <Text fw={700} c="yellow.5" span>RESET</Text> back to the starting 
                    artist or use the <Text fw={700} c='gray.1' span>HINT</Text> to see the target artist{"'"}s related artists.</Text>

                    <Text fw={300}>If you want to hear a preview of an artist{"'"}s music, press and hold on their card.</Text>
                    </Stack>
                </Group>

                <Group justify='center'>
                    <Image w={300} src="how-to-play.png" alt="Clicking an artist box"/>
                </Group>

                <Group wrap="nowrap">
                    <Card shadow="sm" radius="md" padding="5px"
                        w={50}>
                        <Text ta="center">3</Text>
                    </Card>
                    <Text fw={300}>To win, make sure to select the target artist
                    when they pop up or you&apos;ll miss it! Have fun!</Text>
                </Group>
            </Flex>
        </Modal>
    </Group>
  )
}

export default HowToPlay