import React, { useState } from "react";
import { QuestionIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";

import { GetRecommendRes } from "../../api/problem";

interface TooltipProps {
  recommends: GetRecommendRes | null;
}

function Tooltip({ recommends }: TooltipProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggleTooltip = () => {
    setTooltipOpen(prev => !prev);
  };

  return (
    <>
      <QuestionIcon
        w={10}
        h={10}
        color="dep_1"
        position="absolute"
        borderRadius="50%"
        shadow="2px 4px 4px rgba(0, 0, 0, 0.25)"
        top={10}
        right={12}
        cursor="help"
        onMouseEnter={toggleTooltip}
        onMouseLeave={toggleTooltip}
      />
      <Box
        position="absolute"
        display={`${tooltipOpen ? "block" : "none"}`}
        bg="dep_1"
        top={20}
        right={12}
        p={4}
        shadow="2px 4px 4px rgba(0, 0, 0, 0.25)"
      >
        {recommends?.stat.slice(0, 5).map(v => `${v.type} : ${v.cnt} `)}
      </Box>
    </>
  );
}

export default Tooltip;
