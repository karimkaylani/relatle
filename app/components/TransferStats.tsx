import { createClient } from "@/utils/supabase/client";
import React, { useEffect } from "react";
import IconHoverButton from "./IconHoverButton";
import {
  IconChartBar,
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
        icon={<IconChartBar size={16} />}
        text="TRANSFER STATS"
      />
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={true}
        centered
        padding="xl"
        radius="lg"
        title="Transfer Stats"
        styles={{
          title: {
            fontSize: "20px",
            color: "#f1f3f5",
            fontWeight: 700,
            lineHeight: "32px",
          },
        }}
      >
        <Stack align="center" justify="center">
          <Text ta="center" size="lg" c="gray.1" fw={700}>
            Export stats from this device
          </Text>
          <Text ta="center">
            Press the button below to generate a code to enter into your other
            device
          </Text>
          <Button
            onClick={addStatsToDB}
            variant="filled"
            color="green.6"
            disabled={token !== ""}
            loading={loadingExport}
            leftSection={
              <Image src={"images/custom-icon.svg"} alt="custom-game" />
            }
            styles={{ section: { marginRight: "6px", marginBottom: "4px" } }}
          >
            GENERATE CODE
          </Button>
          {token && <PinInput size="lg" value={token} readOnly />}
          {token && (
            <ShareButton
              shareText={token}
              buttonText={"CODE"}
              defaultColor={"green.6"}
              clickedColor={"green.9"}
            />
          )}
        </Stack>
        <Divider style={{ margin: "25px" }} />
        <Stack align="center" justify="center" gap="md">
          <Text size="lg" c="gray.1" fw={700} ta="center">
            Import stats into this device
          </Text>
          <Text ta="center">Enter code from original device below</Text>
          <Alert
            radius="lg"
            variant="light"
            color="red"
            icon={<IconInfoCircle size={16} />}
          >
            <Text size="sm" fw={700}>
              This will overwrite any of the stats currently on this device
            </Text>
          </Alert>
          <PinInput
            color="gray.1"
            onChange={(value) => {
              setInput(value.toUpperCase());
            }}
            value={input}
            placeholder=""
            size="lg"
            error={error.length > 0}
            style={{ color: "white" }}
          />
          {error.length > 0 && <Text c="red.5">{error}</Text>}
          <Button
            onClick={() => transferStats(input)}
            variant="filled"
            color="green.6"
            loading={loadingImport}
            leftSection={<IconTransfer size={16} />}
            styles={{ section: { marginRight: "6px", marginBottom: "4px" } }}
          >
            TRANSFER STATS
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default TransferStats;
