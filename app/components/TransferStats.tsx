import { createClient } from "@/utils/supabase/client";
import React, { useEffect } from "react";
import IconHoverButton from "./IconHoverButton";
import {
  IconChartBar,
  IconDownload,
  IconInfoCircle,
  IconTransfer,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import {
  Button,
  Modal,
  PinInput,
  Stack,
  Text,
  Image,
  Divider,
  Alert,
} from "@mantine/core";
import { useSearchParams } from "next/navigation";
import ShareButton from "./ShareButton";
import CustomIcon from "./CustomIcon";
import { white, green, dk_green, red } from "../colors";

const generateToken = (): string => {
  // randomly generate 5 character string
  const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
  let token = "";
  for (let i = 0; i < 4; i++) {
    token += digits[Math.floor(Math.random() * digits.length)];
  }
  return token.toUpperCase();
};

const TransferStats = () => {
  const [opened, { open, close }] = useDisclosure();
  const [token, setToken] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [input, setInput] = React.useState<string>("");
  const [loadingExport, setLoadingExport] = React.useState<boolean>(false);
  const [loadingImport, setLoadingImport] = React.useState<boolean>(false);

  const addStatsToDB = async () => {
    setLoadingExport(true);
    const supabase = createClient();
    const date = new Date().toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });

    let currToken = generateToken();
    // see if token is already in use
    let { data, error } = await supabase
      .from("player_stats")
      .select("*")
      .eq("token", token);
    while (data && data.length > 0) {
      currToken = generateToken();
      ({ data, error } = await supabase
        .from("player_stats")
        .select("*")
        .eq("token", token));
    }
    setToken(currToken);
    setLoadingExport(false);

    return supabase.from("player_stats").insert({
      timestamp: date,
      token: currToken,
      stats: localStorage.getItem("props"),
    });
  };

  const transferStats = async (token: string) => {
    setLoadingImport(true);
    if (token.length < 4) {
      setError("Please enter a 4 digit code");
      setLoadingImport(false);
      return false;
    }
    token = token.toUpperCase();
    const supabase = createClient();
    const { data, error } = await supabase
      .from("player_stats")
      .select("*")
      .eq("token", token);
    if (data && data.length > 0) {
      const stats = data[0].stats;
      localStorage.setItem("props", stats);
      // Refresh page with transfer=true so that the sidebar opens
      let url = window.location.href;
      if (!url.includes("transfer=true")) {
        if (url.indexOf("?") > -1) {
            url += "&transfer=true";
        } 
        else {
            url += "?transfer=true";
        }
      }
      window.location.href = url;
      return true;
    } else {
      setError("Token not found");
      setLoadingImport(false);
      return false;
    }
  };

  return (
    <>
      <IconHoverButton
        onTap={open}
        icon={<IconDownload style={{transform: 'rotate(-90deg)'}} size={16} color={white}/>}
        text="Transfer Stats"
      />
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={true}
        centered
        padding="lg"
        radius="lg"
        title="Transfer Stats"
        styles={{
          title: {
            fontSize: "20px",
            color: white,
            fontWeight: 700,
            lineHeight: "32px",
          },
          header: { paddingBottom: "16px" },
        }}
      >
        <Stack align="center" justify="center">
          <Text ta="center" size="md" c={white} fw={700}>
            Export stats from this device
          </Text>
          <Text ta="center">
            Generate a code to enter into your target device
          </Text>
          <Button
            onClick={addStatsToDB}
            variant="filled"
            color={green}
            disabled={token !== ""}
            loading={loadingExport}
            leftSection={
              <CustomIcon size={18} />
            }
            styles={{ section: { marginRight: "6px" } }}
          >
            Generate Code
          </Button>
          {token && <PinInput size="lg" value={token} readOnly />}
          {token && (
            <ShareButton
              shareText={token}
              buttonText={"Code"}
              defaultColor={green}
              clickedColor={dk_green}
            />
          )}
        </Stack>
        <Divider style={{ margin: "25px" }} />
        <Stack align="center" justify="center" gap="md">
          <Text size="md" c={white} fw={700} ta="center">
            Import stats into this device
          </Text>
          <Text ta="center">Enter the code generated from the source device</Text>
          <Alert
            radius="lg"
            variant="light"
            color="red"
            icon={<IconInfoCircle size={16} />}
          >
            <Text size="sm" fw={700}>
              This will overwrite the data currently on this device
            </Text>
          </Alert>
          <PinInput
            color={white}
            onChange={(value) => {
              setInput(value.toUpperCase());
            }}
            value={input}
            placeholder=""
            size="lg"
            error={error.length > 0}
            style={{ color: white }}
          />
          {error.length > 0 && <Text c={red}>{error}</Text>}
          <Button
            onClick={() => transferStats(input)}
            variant="filled"
            color={green}
            loading={loadingImport}
            leftSection={<IconTransfer size={16} />}
            styles={{ section: { marginRight: "6px"} }}
          >
            Transfer Stats
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default TransferStats;
