import { Button } from "@mantine/core";
import React from "react";
import { yellow } from "../colors";

export interface ResetProps {
  resetHandler: () => void;
}

const Reset = (props: ResetProps) => {
  const { resetHandler } = props;
  return (
    <Button
      onClick={resetHandler}
      size="md"
      color={yellow}
      fw={700}
      variant="filled"
    >
      Reset
    </Button>
  );
};

export default Reset;
