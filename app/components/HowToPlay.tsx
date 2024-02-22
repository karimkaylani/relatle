import { Modal, Text, Image, Group, Flex, Card, Stack, Title, Center, List } from '@mantine/core'
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
            <Stack align="left" gap="lg">
                <Group wrap="nowrap">
                    <Card
                        shadow="sm" radius="md"
                        padding="5px" w={30}>
                        <Text ta="center">1</Text>
                    </Card>
                    <Text fw={300}>Identify the artist matchup of the day</Text>
                </Group>
                
                <Matchup start={start} end={end} small={true}/>

                <Group wrap="nowrap" align='left'>
                    <Card shadow="sm" radius="md" padding="5px" w={85} h={33}>
                        <Text ta="center">2</Text>
                    </Card>
                    <Stack align='center' justify='center'>

                    <Text fw={300}>Identify the grid of the starting artist's related artists on the page</Text>
                    <Text fw={300}>You can select one by pressing on their card and the grid will update to show the related artists of the artist you selected.      
                    Continue to choose related artists that you think would get you closer to the target artist</Text>

                    <Text fw={300}>If you get stuck, you can <Text fw={700} c="yellow.5" span>RESET</Text> back to the starting 
                    artist or use the <Text fw={700} c='gray.1' span>HINT</Text> to see the target artist{"'"}s related artists</Text>

                    </Stack>
                </Group>

                <Group wrap="nowrap">
                    <Card shadow="sm" radius="md" padding="5px"
                        w={50}>
                        <Text ta="center">3</Text>
                    </Card>
                    <Text fw={300}>To win, make sure to select the target artist
                    once they pop up or you&apos;ll miss it! Have fun!</Text>
                </Group>
                <Center>
                    <Image w={250} src="how-to-play.png" alt="Clicking an artist box"/>
                </Center>
                <Stack className='mr-7 ml-7' align='center'>
                    <Title c='gray.1' order={4}>Related Artists?</Title>
                    <Text fw={300}>Related artists for a particular artist are the other artists their fans are likely listen to. It's based on the "Fans Also Like" or "Similar Artists" sections you'll find on music services</Text>
                </Stack>
            </Stack>
        </Modal>
    </Group>
  )
}

export default HowToPlay