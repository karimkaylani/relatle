import { Button, Divider, Flex, Text } from '@mantine/core'
import React, { Fragment } from 'react'

export interface ResetProps {
    resetHandler: () => void
}

const Reset = (props: ResetProps) => {
    const {resetHandler} = props
  return (
    <Flex
    align="center"
    direction="column"
    gap="xs"
    className='pt-10'>
      <Button onClick={resetHandler} size="md" color="yellow.7" variant="filled">RESET</Button>
      <Text ta="center" size="md">Feeling stuck?</Text>
    </Flex>
  )
}

export default Reset