package com.ssafy.studyroom.webSocket.service;

import com.ssafy.studyroom.webSocket.repository.RoomRepository;
import org.springframework.stereotype.Service;

@Service
public class RoomServiceImpl implements RoomService{
    private final RoomRepository roomRepository;

    public RoomServiceImpl(RoomRepository roomRepository){
        this.roomRepository = roomRepository;
    }
}
