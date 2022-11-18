import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  keyframes,
  Select,
  Stack,
  Text
} from "@chakra-ui/react";
import React, { useState, useRef } from "react";

import DIFFICULTY from "utils/DIFFICULTY";
import TAG from "utils/TAG";

const animation = keyframes`
0%{
  transform: translateY(-10%);
  opacity: 0;
}
100% {
    transform: translateY(0%);
}
`;
interface Iprops {
  fetch: (level?: string, tag?: string) => Promise<void>;
}
function Filter({ fetch }: Iprops) {
  const [open, setOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const closeFilter = () => {
    ref.current?.animate(
      [
        { transform: "translateY(0%)" },
        { transform: "translateY(-10%)", opacity: 0 }
      ],
      {
        duration: 300,
        easing: "ease-out"
      }
    );
    setTimeout(() => {
      setOpen(prev => false);
    }, 300);
  };
  const openFilter = () => {
    setOpen(true);
  };
  const toggle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    if (target.id === "filter") {
      if (open) closeFilter();
      else openFilter();
    }
  };
  return (
    <Box>
      <Flex
        h={10}
        p={2}
        px={3}
        bg="dep_1"
        position="absolute"
        borderRadius="10px"
        shadow="2px 4px 4px rgba(0, 0, 0, 0.25)"
        top={10}
        right={12}
        cursor="pointer"
        justifyContent="center"
        alignItems="center"
        id="filter"
        onClick={toggle}
      >
        추천 필터
        {open ? (
          <ChevronUpIcon onClick={closeFilter} w={6} h={6} />
        ) : (
          <ChevronDownIcon onClick={openFilter} w={6} h={6} />
        )}
        {open && (
          <Flex
            position="absolute"
            direction="column"
            gap="20px"
            top="50px"
            right="0"
            w="300px"
            bg="dep_2"
            p={6}
            borderRadius="20px"
            zIndex="1"
            cursor="default"
            shadow="2px 4px 4px rgba(0, 0, 0, 0.25)"
            animation={`${animation} .5s`}
            ref={ref}
          >
            <Flex alignItems="center" justifyContent="space-between">
              <Text>태그</Text>
              <Stack>
                <Select
                  placeholder="상관없음"
                  borderColor="dep_3"
                  value={selectedTag}
                  onChange={e => setSelectedTag(e.target.value)}
                  w="160px"
                >
                  {TAG.map(({ key, ko, text }) => (
                    <option key={key} value={ko}>
                      {text}
                    </option>
                  ))}
                </Select>
              </Stack>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <Text>레벨</Text>
              <Stack>
                <Select
                  placeholder="상관없음"
                  borderColor="dep_3"
                  value={selectedLevel}
                  onChange={e => setSelectedLevel(e.target.value)}
                  w="160px"
                >
                  {Object.entries(DIFFICULTY)
                    .filter(([idx, text]) => idx !== "0")
                    .map(([idx, text]) => (
                      <option key={idx} value={idx}>
                        {text}
                      </option>
                    ))}
                </Select>
              </Stack>
            </Flex>
            <Flex justifyContent="flex-end" gap={4}>
              <Button onClick={closeFilter} bg="dep_3">
                닫기
              </Button>
              <Button
                bg="dep_3"
                onClick={() => {
                  fetch(selectedLevel, selectedTag);
                }}
              >
                적용
              </Button>
            </Flex>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}

export default Filter;
