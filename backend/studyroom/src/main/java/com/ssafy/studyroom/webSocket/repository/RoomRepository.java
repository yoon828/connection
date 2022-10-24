package com.ssafy.studyroom.webSocket.repository;

import com.ssafy.studyroom.webSocket.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
}
