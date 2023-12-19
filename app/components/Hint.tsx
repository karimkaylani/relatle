'use client'

import { Button, Divider, Drawer, SimpleGrid, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconBulb } from '@tabler/icons-react'
import React, { Fragment } from 'react'
import RelatedArtistsTitle from './RelatedArtistsTitle'
import { Artist, phoneMaxWidth } from './Game'
import ArtistCard from './ArtistCard'
import { useSwipeable } from 'react-swipeable'

export interface HintProps {
    endArtist: Artist,
    web: {[key: string]: Artist},
    path: string[]
}

const Hint = (props: HintProps) => {
    const {endArtist, web, path} = props
    const [opened, { open, close }] = useDisclosure(false);
    const swipeHandlers = useSwipeable({
        onSwipedDown: close
    });
  return (
    <Fragment>

    <Drawer.Root opened={opened} onClose={close} size={window.innerWidth > phoneMaxWidth ? '575' : '75%'}
    style={{borderRadius: '20px'}} padding='sm' position={'bottom'}>
      <Drawer.Overlay />
      <Drawer.Content>
        <Drawer.Header {...swipeHandlers} style={{top: -1}} onClick={close}>
          <Drawer.Title style={{width: '100%'}}>
              <RelatedArtistsTitle artist={endArtist} won={false} endArtist={endArtist}/>
          </Drawer.Title>
           <Drawer.CloseButton />
        </Drawer.Header>
        <Drawer.Body>
          <Stack align='center'>
              <SimpleGrid cols={{ base: 2, xs: 3, sm: 3, md: 4, lg: 5 }} >
              {endArtist.related.map((artist_name: string) => 
                  <ArtistCard key={web[artist_name].id} artist={web[artist_name]} path={path} clickable={false}
                  won={false} end={endArtist.name} clicked={false} setClicked={(_) => {}} updateArtistHandler={() => {}}/>)} 
              </SimpleGrid>
          </Stack>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>

    <Button leftSection={<IconBulb size={25}/>}
    color="gray.9" size="md" styles={{ section: {marginRight: "4px"}}} onClick={open}>HINT</Button>

    </Fragment>
  )
}

export default Hint