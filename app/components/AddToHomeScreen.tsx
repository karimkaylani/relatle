import { IconCircleCheck, IconShare2, IconSquareRoundedPlus } from "@tabler/icons-react"
import IconHoverButton from "./IconHoverButton"
import { Modal, Stack, Text, Image, Center } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import { dk_green, green, white } from "../colors";

const AddToHomeScreen = () => {
    const [opened, { open, close }] = useDisclosure();
  return (
    <>
    <IconHoverButton
        onTap={open} 
        icon={<IconSquareRoundedPlus size={24} color="white" />}
        text="Add to Home Screen"
    />
    <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        centered
        padding="lg"
        radius="lg"
        size='sm'
        styles={{
          header: { paddingBottom: "16px" },
        }}
    >
        <Stack>
            <Text ta='center' c={white} fw={700} size='lg'>Add to your Home Screen!</Text>
            <Text ta='center'>Never miss a day of Relatle by having it show as an app on your home screen</Text>
            <IconHoverButton
                onTap={() => {}} 
                icon={<IconShare2 size={24} color="white" />}
                text="Tap the Share icon in your browser"
                centered={false}
                textSize="md"
            />
            <IconHoverButton
                onTap={() => {}} 
                icon={<IconSquareRoundedPlus size={24} color="white" />}
                text="Select 'Add to Home Screen'"
                centered={false}
                textSize="md"
            />
             <IconHoverButton
                onTap={() => {}} 
                icon={<IconCircleCheck size={34} color={green} />}
                text="Play Relatle directly from an app on your Home Screen!"
                textSize="md"
                textColor={green}
                centered={false}
                bg={dk_green}
            />
        </Stack>
    </Modal>
    </>
  )
}

export default AddToHomeScreen