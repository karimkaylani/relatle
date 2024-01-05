import { Modal, Stack, Text, Image, Button } from '@mantine/core'
import React from 'react'

export interface NewFeatureModal {
    newFeatureModalOpened: boolean,
    newFeatureModalHandlers: any
}

const NewFeatureModal = (props: NewFeatureModal) => {
    const {newFeatureModalOpened, newFeatureModalHandlers} = props
    const {close: newFeatureModalClose} = newFeatureModalHandlers
  return (
    <Modal opened={newFeatureModalOpened} 
    onClose={newFeatureModalClose} withCloseButton={false} centered
    padding="xl" radius="lg">
        <Stack align='center' justify='center' gap='lg'>
            <Stack gap='xs'>
                <Text ta='center' c='gray.1' fw={700} size='xl'>Introducing previews</Text>
                <Text ta='center' size='md'>You can now press and hold on an artist to hear a preview of their music. Try it out!</Text>
            </Stack>
            <Image w={163} src='preview.png'/>
            <Button color='gray.7' w={150} onClick={newFeatureModalClose}>GOT IT!</Button>
        </Stack>
    </Modal>
  )
}

export default NewFeatureModal