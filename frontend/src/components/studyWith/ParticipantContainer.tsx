import { Center, Image, Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import { v4 } from "uuid";
import { UserProfileType } from "../../asset/data/socket.type";

interface ParticipantContainerProps {
  users: UserProfileType[];
}
function ParticipantContainer({ users }: ParticipantContainerProps) {
  return (
    <Center m="8px 0">
      <Text fontWeight="700">현재 참가한 사람 : </Text>
      {users &&
        users.map(user => (
          <Tooltip key={v4()} label={user.name}>
            <Image
              ml="8px"
              src={user.imageUrl}
              borderRadius="50px"
              minW="35px"
              w="35px"
            />
          </Tooltip>
        ))}
    </Center>
  );
}

export default ParticipantContainer;
