package com.ssafy.studyroom.webSocket.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.socket.WebSocketSession;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
public class RoomDto {
    private String studyId;
    private String studyCode;
    private int size;
    private LocalDateTime start;
    private LocalDateTime end;
    private ArrayList<Long> problems = new ArrayList<>();
    private Set<WebSocketSession> sessions = new HashSet<>();

    public static RoomDto create(String code){
        RoomDto room = new RoomDto();
        //
        return room;
    }
}
