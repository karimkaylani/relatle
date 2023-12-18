'use client'

import { Button, Drawer, SimpleGrid, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconBulb } from '@tabler/icons-react'
import React, { Fragment } from 'react'
import RelatedArtistsTitle from './RelatedArtistsTitle'
import { Artist } from './Game'
import ArtistCard from './ArtistCard'

export interface HintProps {
    endArtist: Artist,
    web: {[key: string]: Artist},
    path: string[]
}

const Hint = (props: HintProps) => {
    const {endArtist, web, path} = props
    const [opened, { open, close }] = useDisclosure(false);
  return (
    <Fragment>

    <Drawer padding='sm' position={'bottom'} opened={opened} onClose={close} 
    title={<RelatedArtistsTitle artist={endArtist} won={false} endArtist={endArtist}/>}
    styles={{title: {width: '100%'}}}>
        <Stack align='center'>
            <SimpleGrid cols={{ base: 2, xs: 3, sm: 3, md: 4, lg: 5 }}>
            {endArtist.related.map((artist_name: string) => 
                <ArtistCard key={web[artist_name].id} artist={web[artist_name]} path={path} clickable={false}
                 won={false} end={endArtist.name} clicked={false} setClicked={(_) => {}} updateArtistHandler={() => {}}/>)} 
            </SimpleGrid>
        </Stack>
    </Drawer>

    <Button leftSection={<IconBulb size={25}/>}
    color="gray.9" size="md" styles={{ section: {marginRight: "4px"}}} onClick={open}>HINT</Button>

    </Fragment>
  )
}

export default Hint