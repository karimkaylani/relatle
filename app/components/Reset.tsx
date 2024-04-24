import { Button } from "@mantine/core";
import React from "react";
import { yellow } from "../colors";
import RelatleButton from "./RelatleButton";
import { IconRefresh } from "@tabler/icons-react";

export interface ResetProps {
  resetHandler: () => void;
}

const Reset = (props: ResetProps) => {
  const { resetHandler } = props;
  return (
    <RelatleButton text="Reset" color={yellow} borderColor={yellow} onClick={resetHandler} icon={<IconRefresh size={18}/>}/>
  );
};
export default Reset;
