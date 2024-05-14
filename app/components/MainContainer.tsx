import { Flex } from "@mantine/core";
import React from "react";

export interface MainContainerProps {
  children: React.ReactNode;
}

const MainContainer = ({ children }: MainContainerProps) => {
  return (
    <Flex
      align="center"
      direction="column"
      gap="lg"
      className="mt-5 pb-14 pl-5 pr-5"
    >
      {children}
    </Flex>
  );
};

export default MainContainer;
