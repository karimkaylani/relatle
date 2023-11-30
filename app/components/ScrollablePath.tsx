import { Avatar, Group, ScrollArea, Text } from '@mantine/core'
import React, { Fragment } from 'react'
import { Artist } from './Game'

export interface ScrollablePathProps {
    matchup: string[],
    web: {[key: string]: Artist},
    path: string[]
}

const ScrollablePath = (props: ScrollablePathProps) => {
    const {matchup, web, path} = props
    const [start, end] = matchup
  return (
    <ScrollArea h={160} className="p-5" type="always" offsetScrollbars scrollbarSize={4}>
        <Group justify="flex-start" gap="xs">
        {path.slice(0, -1).map(artist_name => (
            artist_name !== "RESET" ?
            <Fragment>
                <Group justify="flex-start" gap="xs">
                    <Avatar size="sm" src={web[artist_name].image} alt={web[artist_name].name}/>
                    <Text c="gray.1" size="14px" fw={500}>{web[artist_name].name}</Text>
                </Group>
                <Text fw={500} c="gray.1" size="14px">→</Text>
            </Fragment> 
            :
            <Fragment>
                <Text c="yellow.7" size="14px" fw={500}>RESET</Text>
                <Text fw={500} c="gray.1" size="14px">→</Text>
            </Fragment>
        ))}
            <Group justify="flex-start" gap="xs">
                <Avatar size="sm" src={web[end].image} alt={end}
                styles={{
                    image: { border: '1.5px solid #51cf66', borderRadius: "100%"  }
                }}/>
                <Text c="green.5" size="14px" fw={700}>{end}</Text>
            </Group>
        </Group>

    </ScrollArea>
  )
}

export default ScrollablePath