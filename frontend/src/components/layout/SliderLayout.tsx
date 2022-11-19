import React, { ReactNode, useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import SlideArrow from "../study/subject/SlideArrow";

interface SliderLayoutProps {
  len: number;
  children: ReactNode;
}

function SliderLayout({ len, children }: SliderLayoutProps) {
  const [currentIdx, setCurrentIdx] = useState(len - 1);
  const [total, setTotal] = useState(len - 1);
  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTotal(len - 1);
  }, [len]);

  useEffect(() => {
    if (slideRef.current) {
      slideRef.current.style.transition = "all 0.5s ease-in-out";
      slideRef.current.style.transform = `translateX(-${currentIdx}00%)`;
    }
  }, [currentIdx]);

  const prevSlide = () => {
    if (currentIdx !== 0) setCurrentIdx(currentIdx - 1);
  };
  const nextSlide = () => {
    if (currentIdx <= total) setCurrentIdx(currentIdx + 1);
  };

  return (
    <Box w="100%" h="100%" overflow="hidden" position="relative">
      <Box
        display="flex"
        ref={slideRef}
        h="100%"
        transform={`translateX(-${total}00%)`}
      >
        {children}
      </Box>

      <SlideArrow
        type="left"
        onClick={prevSlide}
        isDisabled={currentIdx === 0}
        Icon={ChevronLeftIcon}
      />
      <SlideArrow
        type="right"
        onClick={nextSlide}
        isDisabled={currentIdx === total}
        Icon={ChevronRightIcon}
      />
      {/* </Box> */}
    </Box>
  );
}

export default SliderLayout;
