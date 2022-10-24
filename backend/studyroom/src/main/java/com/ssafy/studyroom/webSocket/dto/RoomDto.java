package com.ssafy.studyroom.webSocket.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
public class RoomDto {
    private String code;
    private int max;
    private Set<WebSocketSession> sessions = new HashSet<>();

    public static RoomDto create(String code){
        RoomDto room = new RoomDto();

        room.code = code;

        return room;
    }
}
