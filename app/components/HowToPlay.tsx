import { Modal, Text, Image, Group, Flex, Card } from '@mantine/core'
import React from 'react'
import HoverButton from './HoverButton';
import { Artist } from './Game';
import ArtistInfo from './ArtistInfo';

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
            <Image w={30} src="question.svg" alt="How To Play"/>
        </HoverButton>
        <Modal opened={opened} 
        onClose={close} withCloseButton={true} centered
        padding="xl" radius="lg"
        title="How to Play"
        styles={{ title: { fontSize: "25px", color: "#f1f3f5" } }}>
            <Flex 
            align="left"
            direction="column"
            gap="lg">
                <Group wrap="nowrap">
                    <Card
                        shadow="sm"
                        radius="md"
                        padding="5px"
                        w={30}>
                        <Text ta="center">1</Text>
                    </Card>
                    <Text fw={300}>Identify the artist matchup of the day</Text>
                </Group>

                <Group justify="center">
                    <ArtistInfo artist={start} small={true} is_green={false}></ArtistInfo>
                    <Text fw={500} c="gray.1" size="25px">→</Text>
                    <ArtistInfo artist={end} small={true} is_green={true}></ArtistInfo>
                </Group>

                <Group wrap="nowrap">
                    <Card
                        shadow="sm"
                        radius="md"
                        padding="5px"
                        w={50}>
                        <Text ta="center">2</Text>
                    </Card>
                    <Text fw={300}>Continue to choose related artists that would get
                    you closer to the target artist. You can <Text fw={800} c="yellow.5" span>RESET</Text> if you get stuck</Text>
                </Group>

                <Group justify='center'>
                    <Image w={300} src="how-to-play.png" alt="Clicking an artist box"/>
                </Group>

                <Group wrap="nowrap">
                    <Card
                        shadow="sm"
                        radius="md"
                        padding="5px"
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