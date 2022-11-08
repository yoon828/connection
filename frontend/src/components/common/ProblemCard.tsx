import React from "react";
import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { AddIcon, DeleteIcon, LinkIcon } from "@chakra-ui/icons";
import { Problem } from "../../@types/Problem";
import DIFFICULTY from "../../utils/DIFFICULTY";

interface CardButtonProps {
  btnType: "delete" | "add";
  onBtnClick: React.MouseEventHandler<HTMLDivElement>;
}
interface ProblemCardProps extends CardButtonProps {
  problem: Problem;
  bg?: string;
  hasBtn?: boolean;
}

function Button({ btnType, onBtnClick }: CardButtonProps) {
  if (btnType === "delete") {
    return (
      <Box onClick={onBtnClick}>
        <DeleteIcon w="6" h="6" cursor="pointer" alignSelf="center" />
      </Box>
    );
  }
  return (
    <Box onClick={onBtnClick}>
      <AddIcon w="6" h="6" cursor="pointer" alignSelf="center" />
    </Box>
  );
}

function ProblemCard({
  problem,
  btnType,
  onBtnClick,
  bg,
  hasBtn
}: ProblemCardProps) {
  const { problemInfo, tagList, difficulty } = problem;
  const { problemId, title, level } = problemInfo;
  return (
    <Flex
      direction="column"
      bg={bg}
      borderRadius="20px"
      p="20px 20px 0 20px"
      boxShadow="0 4px 4px rgba(0,0,0,0.25)"
      _hover={{
        transform: "scale(1.03)",
        transition: "transform ease-out .5s"
      }}
      // maxH="250px"
    >
      <Box pb="20px" mb="auto">
        <Flex
          justifyContent="space-between"
          mt="10px"
          mb="10px"
          alignItems="center"
        >
          <Flex>
            <Link
              href={`https://www.acmicpc.net/problem/${problemId}`}
              isExternal
              fontSize="2xl"
              fontWeight="bold"
              noOfLines={3}
            >
              {title}
              <LinkIcon w="18px" h="18px" mx="2" marginBottom={2} />
            </Link>
          </Flex>
          {hasBtn && <Button btnType={btnType} onBtnClick={onBtnClick} />}
        </Flex>
        <Flex gap="8px" wrap="wrap">
          {tagList.map(tag => (
            <Box
              key={tag.tagId}
              bg="dep_3"
              w="fit-content"
              p="4px 16px"
              borderRadius="15px"
              fontSize="sm"
            >
              #{tag.ko}
            </Box>
          ))}
        </Flex>
      </Box>
      <Flex
        justifyContent="space-between"
        py="20px"
        borderTop="1px"
        borderColor="border_gray"
      >
        <Flex gap={2} p={1}>
          <Text alignSelf="flex-start">백준 난이도 </Text>
          <img
            style={{ paddingTop: 5 }}
            width="15px"
            height="100%"
            src={`https://static.solved.ac/tier_small/${level}.svg`}
            alt={DIFFICULTY[level]}
          />
        </Flex>
        <Flex gap={2} p={1}>
          <Text alignSelf="flex-start">체감 난이도 </Text>
          <img
            style={{ paddingTop: 5 }}
            width="15px"
            height="100%"
            src={`https://static.solved.ac/tier_small/${difficulty}.svg`}
            alt={DIFFICULTY[difficulty]}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

ProblemCard.defaultProps = {
  bg: "dep_1",
  hasBtn: true
};
export default ProblemCard;
