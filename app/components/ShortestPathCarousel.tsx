import { Embla, Carousel, useAnimationOffsetEffect } from "@mantine/carousel";
import { Center } from "@mantine/core";
import React, { use, useCallback, useEffect, useState } from "react";
import { white } from "../colors";
import { Artist, phoneMaxWidth } from "./Game";
import ScrollablePath from "./ScrollablePath";
import { minPathCollapseAnimationDuration } from "./GameOver";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

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
  const [atBeginning, setAtBeginning] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const handleScroll = useCallback(() => {
    if (embla) {
      setAtBeginning(!embla.canScrollPrev());
      setAtEnd(!embla.canScrollNext());
    }
  }, [embla]);

  useEffect(() => {
    if (embla) {
      embla.on('scroll', handleScroll);
      handleScroll();
    }
  }, [embla, handleScroll]);


  // because its in an animated container, need this to fix offset issue
  useAnimationOffsetEffect(embla, minPathCollapseAnimationDuration);
  return (
    <Carousel
      slideGap="sm"
      withIndicators={minPaths.length > 1}
      withControls={minPaths.length > 1 && window.innerWidth > phoneMaxWidth}
      draggable={minPaths.length > 1}
      w={window.innerWidth > phoneMaxWidth ? 600 : window.innerWidth - 10}
      getEmblaApi={setEmbla}
      controlSize={23}
      nextControlIcon={!atEnd && <IconChevronRight color={white} />}
      nextControlProps={{ disabled: atEnd }}
      previousControlIcon={!atBeginning && <IconChevronLeft color={white} />}
      previousControlProps={{ disabled: atBeginning }}
      styles={{
        root: { paddingBottom: "10px" },
        indicator: { backgroundColor: white, width: "8px", height: "8px" },
        indicators: { bottom: "-10px" },
        control: { backgroundColor: "transparent", border: "none" },
      }}
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
