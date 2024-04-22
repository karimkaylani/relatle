import { Button } from "@mantine/core";
import React from "react";

export interface ResetProps {
  resetHandler: () => void;
}

const Reset = (props: ResetProps) => {
  const { resetHandler } = props;
  return (
    <Button
      onClick={resetHandler}
      size="md"
      color="yellow.7"
      fw={700}
      variant="filled"
    >
      Reset
    </Button>
  );
};

export default Reset;
