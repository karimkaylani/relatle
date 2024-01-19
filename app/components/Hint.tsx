'use client'

import { Button, Drawer, SimpleGrid, Text, Stack, Space } from '@mantine/core'
import { useDisclosure, useIntersection } from '@mantine/hooks'
import { IconBulb } from '@tabler/icons-react'
import React, { Fragment, useRef, useState } from 'react'
import RelatedArtistsTitle from './RelatedArtistsTitle'
import { Artist, phoneMaxWidth } from './Game'
import ArtistCard from './ArtistCard'
import { useSwipeable } from 'react-swipeable'

export interface HintProps {
    endArtist: Artist,
    web: {[key: string]: Artist},
    path: string[],
    setUsedHint: (usedHint: boolean) => void
}

const Hint = (props: HintProps) => {
    const {endArtist, web, path, setUsedHint} = props
    const [opened, { open, close }] = useDisclosure(false);
    const headerSwipeHandlers = useSwipeable({
        onSwipedDown: close
    })
    const drawerSwipeHandlers = useSwipeable({
        onSwipedDown: () => {
            if (entry?.isIntersecting) {
                close()
            }
        }
    })
  // Allow swipe down to close drawer from top of drawer
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 0,
  });
  return (
    <Fragment>

    <Drawer.Root{...drawerSwipeHandlers} opened={opened} onClose={close} size={window.innerWidth > phoneMaxWidth ? '610' : '75%'}
    style={{borderRadius: '20px'}} padding='sm' position={'bottom'}>
      <Drawer.Overlay/>
      <Drawer.Content>
        <Drawer.Header {...headerSwipeHandlers} style={{top: -1}} onClick={close}>
          <Drawer.Title style={{width: '100%'}}>
              <Stack gap='xs'>
              <RelatedArtistsTitle artist={endArtist} won={false} endArtist={endArtist}/>
              <Text ta='center'><b>Note:</b> These artists aren't guaranteed to be related in both directions</Text>
              </Stack>
          </Drawer.Title>
           <Drawer.CloseButton />
        </Drawer.Header>
        <Drawer.Body>
            <Stack align='center'>
                <Space h={0} ref={ref}/>
                <SimpleGrid cols={{ base: 2, xs: 3, sm: 3, md: 4, lg: 5 }}>
                {endArtist.related.map((artist_name: string) => 
                    <ArtistCard key={web[artist_name].id} artist={web[artist_name]} path={path} clickable={false}
                    won={false} end={endArtist.name} clicked={false} setClicked={(_) => {}} updateArtistHandler={() => {}}/>)} 
                </SimpleGrid>
            </Stack>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>

    <Button leftSection={<IconBulb size={25}/>}
    color="gray.9" size="md" styles={{ section: {marginRight: "4px"}}} onClick={() => {
        open()
        setUsedHint(true)
    }}>HINT</Button>

    </Fragment>
  )
}

export default Hint