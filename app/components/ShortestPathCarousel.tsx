import { Embla, Carousel, useAnimationOffsetEffect } from "@mantine/carousel";
import { Center } from "@mantine/core";
import React, { useState } from "react";
import { white } from "../colors";
import { Artist, phoneMaxWidth } from "./Game";
import ScrollablePath from "./ScrollablePath";
import { minPathCollapseAnimationDuration } from "./GameOver";

export interface ShortestPathCarouselProps {
  matchup: string[];
  web: { [key: string]: Artist };
  minPaths: string[][];
}

const ShortestPathCarousel = ({
  matchup,
  web,
  minPaths,
}: ShortestPathCarouselProps) => {
  const [embla, setEmbla] = useState<Embla | null>(null);

  // because its in an animated container, need this to fix offset issue
  useAnimationOffsetEffect(embla, minPathCollapseAnimationDuration);
  return (
    <Carousel
      slideGap="sm"
      withIndicators
      w={window.innerWidth > phoneMaxWidth ? 600 : window.innerWidth - 10}
      getEmblaApi={setEmbla}
      controlSize={23}
      styles={{
        root: { paddingBottom: "10px" },
        indicator: { backgroundColor: white, width: '8px', height: '8px' },
        indicators: { bottom: "-10px" },
        control: {color: white}
      }}
      loop
    >
      {minPaths.map((minPath, index) => (
        <Carousel.Slide key={index}>
          <Center className="pl-4 pr-4">
            <ScrollablePath
              matchup={matchup}
              web={web}
              path={minPath}
            ></ScrollablePath>
          </Center>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};

export default ShortestPathCarousel;
