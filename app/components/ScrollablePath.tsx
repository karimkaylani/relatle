import { Group, ScrollArea, Text } from '@mantine/core'
import React, { Fragment } from 'react'
import { Artist } from './Game'
import ArtistInfo from './ArtistInfo'
import Arrow from './Arrow'

export interface ScrollablePathProps {
    matchup: string[],
    web: {[key: string]: Artist},
    path: string[]
}

const ScrollablePath = (props: ScrollablePathProps) => {
    const {matchup, web, path} = props
    const [start, end] = matchup
  return (
    <ScrollArea className="pl-5 pr-5" type="auto" offsetScrollbars scrollbarSize={6}
    styles={{
        viewport: {maxHeight: 155}
    }}>
        <Group justify="flex-start" gap="xs">
        {path.slice(0, -1).map((artist_name, index) => (
            artist_name !== "RESET" ?
            <Fragment key={index}>
                <ArtistInfo artist={web[artist_name]} small={true}></ArtistInfo>
                <Arrow small={true}/>
            </Fragment> 
            :
            <Fragment key={index}>
                <Text c="yellow.5" size="13px" fw={500}>RESET</Text>
                <Arrow small={true}/>
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