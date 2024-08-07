import {
  Modal,
  Text,
  Image,
  Group,
  Card,
  Stack,
  Title,
  Center,
} from "@mantine/core";
import React from "react";
import HoverButton from "./HoverButton";
import { Artist, phoneMaxWidth } from "./Game";
import {
  IconHelp,
  IconHelpCircle,
  IconHelpOff,
  IconHelpSmall,
  IconQuestionMark,
} from "@tabler/icons-react";
import Matchup from "./Matchup";
import { white, yellow, red, green } from "../colors";

export interface HowToPlayProps {
  start: Artist;
  end: Artist;
  opened: boolean;
  handlers: any;
}

const HowToPlay = (props: HowToPlayProps) => {
  const { start, end, opened, handlers } = props;
  const { open, close } = handlers;
  return (
    <Group justify="flex-end">
      <HoverButton onTap={open}>
        <IconHelpCircle aria-label="Open how to play" size={24} />
      </HoverButton>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={true}
        centered
        padding="lg"
        radius="lg"
        title="How to Play"
        styles={{
          title: {
            fontSize: "20px",
            color: white,
            fontWeight: 700,
            lineHeight: "32px",
          },
          header: { top: -1, paddingBottom: '8px' },
        }}
      >
        <Stack align="left" gap="md">
          <Group wrap="nowrap">
            <Card shadow="sm" radius="md" padding="5px" w={32}>
              <Text c={white} fw={700} ta="center">
                1
              </Text>
            </Card>
            <Text fw={300}>Identify the <Text fw={500} c={white} span>artist matchup</Text>:</Text>
          </Group>
          <Matchup start={start} end={end} small={true} />

          <Group wrap="nowrap" justify="flex-start" align="flex-start">
            <Card shadow="sm" radius="md" padding="5px" w={68} h={33}>
              <Text fw={700} c={white} ta="center">
                2
              </Text>
            </Card>
            <Stack align="center" justify="center">
              <Text fw={300}>
              <Text fw={500} c={white} span>Tap on the related artists</Text> that you think will get you closer to
                the target artist.{" "}
                <Text fw={500} c={white} span>Press and hold</Text> on an artist to hear a <Text fw={500} c={white} span>sample of their music</Text>.
                The less steps it takes you, <Text fw={500} c={green} span>the better your score!</Text> 
              </Text>

              <Text fw={300}>
                If you get stuck, you can{" "}
                <Text fw={700} c={yellow} span>
                  Reset
                </Text>
                {", "}
                use the{" "}
                <Text fw={700} c={white} span>
                  Hint
                </Text>
                {", "}
                or{" "}
                <Text fw={700} c={red} span>
                  Give Up
                </Text>
                {"."}
              </Text>
            </Stack>
          </Group>

          <Group wrap="nowrap">
            <Card shadow="sm" radius="md" padding="5px" w={41}>
              <Text c={white} fw={700} ta="center">
                3
              </Text>
            </Card>
            <Text fw={300}>
            <Text fw={500} c={white} span>Select the target artist</Text> once they pop up or you&apos;ll miss it!
              Have fun!
            </Text>
          </Group>
          <Center>
            <Image
              w={window.innerWidth > phoneMaxWidth ? 250 : 175}
              src="images/how-to-play.png"
              alt="Clicking an artist box"
            />
          </Center>
          <Group wrap="nowrap" justify="flex-start" align="flex-start">
            <Card shadow="sm" radius="md" p="1px" w={90} h={33}>
              <Center>
                <IconHelpSmall style={{minWidth: '30px'}} size={30} />
              </Center>
            </Card>
            <Stack gap="0px">
              <Text fw={700} c={white} span>
                {"What's a related artist?"}
              </Text>
              <Text fw={300}>
                Related artists are based on the &quot;Fans Also Like&quot; sections on music services.
                They use data from listeners of an artist to identify <Text fw={500} c={white} span> other artists that fans frequently listen to. </Text>
              </Text>
            </Stack>
          </Group>
        </Stack>
      </Modal>
    </Group>
  );
};

export default HowToPlay;
