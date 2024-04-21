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
import { Artist } from "./Game";
import {
  IconHelp,
  IconHelpCircle,
  IconHelpOff,
  IconHelpSmall,
  IconQuestionMark,
} from "@tabler/icons-react";
import Matchup from "./Matchup";

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
        padding="xl"
        radius="lg"
        title="How to Play"
        styles={{
          title: {
            fontSize: "24px",
            color: "#f1f3f5",
            fontWeight: 700,
            lineHeight: "32px",
          },
          header: { top: -1, paddingBottom: '8px' },
        }}
      >
        <Stack align="left" gap="lg">
          <Group wrap="nowrap">
            <Card shadow="sm" radius="md" padding="5px" w={32}>
              <Text c="gray.1" fw={700} ta="center">
                1
              </Text>
            </Card>
            <Text fw={300}>Identify the artist matchup of the day</Text>
          </Group>

          <Matchup start={start} end={end} small={true} />

          <Group wrap="nowrap" justify="flex-start" align="flex-start">
            <Card shadow="sm" radius="md" padding="5px" w={68} h={33}>
              <Text fw={700} c="gray.1" ta="center">
                2
              </Text>
            </Card>
            <Stack align="center" justify="center">
              <Text fw={300}>
                Tap on the related artists that you think will get you closer to
                the target artist. The less steps it takes you, the better your
                score!
              </Text>

              <Text fw={300}>
                If you get stuck, you can{" "}
                <Text fw={700} c="yellow.5" span>
                  RESET
                </Text>
                {", "}
                use the{" "}
                <Text fw={700} c="gray.1" span>
                  HINT
                </Text>
                {", "}
                or{" "}
                <Text fw={700} c="red.6" span>
                  GIVE UP
                </Text>
                {"."}
              </Text>
            </Stack>
          </Group>

          <Group wrap="nowrap">
            <Card shadow="sm" radius="md" padding="5px" w={41}>
              <Text c="gray.1" fw={700} ta="center">
                3
              </Text>
            </Card>
            <Text fw={300}>
              Select the target artist once they pop up or you&apos;ll miss it!
              Have fun!
            </Text>
          </Group>
          <Center>
            <Image
              w={250}
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
              <Text fw={700} c="gray.1" span>
                {"What's a related artist?"}
              </Text>
              <Text fw={300}>
                Related artists are based on the &quot;Fans Also Like&quot;
                section {"you'll"} find on music streaming services which take user
                listening habits into account.
              </Text>
            </Stack>
          </Group>
        </Stack>
      </Modal>
    </Group>
  );
};

export default HowToPlay;
