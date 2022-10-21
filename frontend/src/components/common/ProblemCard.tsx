import React, { ReactNode } from "react";
import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export interface Tag {
  id: number;
  title: string;
}
export interface Problem {
  title: string;
  link: string;
  tags: Tag[];
  elapsedTime: string;
  difficulty: string;
}

interface ProblemCardProps {
  problem: Problem;
  button?: ReactNode;
}
function ProblemCard({ problem, button }: ProblemCardProps) {
  const { title, link, tags, elapsedTime, difficulty } = problem;
  return (
    <Box
      bg="dep_1"
      borderRadius="20px"
      p="20px"
      boxShadow="0 4px 4px rgba(0,0,0,0.25)"
      _hover={{
        transform: "scale(1.03)",
        transition: "transform ease-out .5s"
      }}
    >
      <Box borderBottom="1px" borderColor="border_gray" pb="20px" mb="20px">
        <Flex justifyContent="space-between" mt="10px" mb="10px">
          <Flex>
            <Link href={link} isExternal fontSize="2xl" fontWeight="bold">
              {title}
              <ExternalLinkIcon mx="2" />
            </Link>
          </Flex>
          {button}
        </Flex>
        <Flex gap="8px">
          {tags.map(tag => (
            <Box
              key={tag.id}
              bg="gra"
              w="fit-content"
              p="4px 16px"
              borderRadius="15px"
            >
              {tag.title}
            </Box>
          ))}
        </Flex>
      </Box>
      <Box>
        <Text mb="10px">소요시간 : {elapsedTime}</Text>
        <Text>체감 난이도 : {difficulty}</Text>
      </Box>
    </Box>
  );
}

ProblemCard.defaultProps = {
  button: null
};

export default ProblemCard;
