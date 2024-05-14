import React from "react";
import RelatleButton from "./RelatleButton";
import { black, white } from "../colors";
import { SortOrder, SortParameter } from "./TopCustomGames";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { Group } from "@mantine/core";

export interface SortButtonsProps {
  sortParameter: SortParameter;
  sortOrder: SortOrder;
  sort: (param: SortParameter, order: SortOrder) => void;
}

const SortButtons = (props: SortButtonsProps) => {
  const { sortParameter, sortOrder, sort } = props;

  const clickHandler = (param: SortParameter) => {
    if (sortParameter === param) {
        sort(param, sortOrder === SortOrder.asc ? SortOrder.desc : SortOrder.asc);
    } else {
        sort(param, SortOrder.desc);
    }
  };
  return (
    <Group justify="center" align="center" gap='sm'>
      {Object.values(SortParameter).map((param) => (
        <RelatleButton
          text={param}
          key={param}
          color={white}
          size='sm'
          textColor={sortParameter === param ? black : white}
          filled={sortParameter === param}
          icon={
            sortParameter === param ? (
              sortOrder === SortOrder.asc ? (
                <IconArrowUp
                  color={
                    sortParameter === param ? black : white
                  }
                />
              ) : (
                <IconArrowDown
                  color={
                    sortParameter === param ? black : white
                  }
                />
              )
            ) : undefined
          }
          onClick={() => clickHandler(param)}
        />
      ))}
    </Group>
  );
};

export default SortButtons;
