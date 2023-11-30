import { Avatar, Group, ScrollArea, Text } from '@mantine/core'
import React, { Fragment } from 'react'
import { Artist } from './Game'
import ArtistInfo from './ArtistInfo'

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
                <ArtistInfo artist={web[artist_name]} small={true} is_green={false}></ArtistInfo>
                <Text fw={500} c="gray.1" size="14px">→</Text>
            </Fragment> 
            :
            <Fragment>
                <Text c="yellow.7" size="14px" fw={500}>RESET</Text>
                <Text fw={500} c="gray.1" size="14px">→</Text>
            </Fragment>
        ))}
            <Group justify="flex-start" gap="xs">
            <ArtistInfo artist={web[end]} small={true} is_green={true}></ArtistInfo>
            </Group>
        </Group>

    </ScrollArea>
  )
}

export default ScrollablePath