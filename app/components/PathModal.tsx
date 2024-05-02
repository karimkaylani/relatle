import { Modal, Stack } from '@mantine/core';
import React from 'react'
import { white } from '../colors';
import Matchup from './Matchup';
import Scoreboard from './Scoreboard';
import ScrollablePath from './ScrollablePath';
import { Artist } from './Game';

export interface PathModalProps {
    opened: boolean;
    handlers: any;
    matchup: string[];
    guesses: number;
    resets: number;
    web: { [key: string]: Artist };
    path: string[];
}

const PathModal = (props: PathModalProps) => {
    const { opened, handlers, matchup, guesses, resets, web, path } = props;
    const { close: close } = handlers;
  return (
    <Modal
        opened={opened}
        onClose={close}
        padding="lg"
        radius="lg"
        title="Your Current Path"
        styles={{
            title: {
                fontSize: "24px",
                color: white,
                fontWeight: 700,
                lineHeight: "32px",
                textAlign: "center",
                width: "100%",
            },
            header: {
                paddingBottom: "14px",
            }
        }}
    >
        <Stack align='center'>
            <Matchup start={web[matchup[0]]} end={web[matchup[1]]} small={true} />
            <Scoreboard guesses={guesses} resets={resets} />
            <ScrollablePath matchup={matchup} web={web} path={path} />
        </Stack>
    </Modal>
  )
}

export default PathModal