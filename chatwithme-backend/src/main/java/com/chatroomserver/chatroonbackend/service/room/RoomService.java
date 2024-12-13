package com.chatroomserver.chatroonbackend.service.room;

import com.chatroomserver.chatroonbackend.dto.request.RoomCreationRequest;
import com.chatroomserver.chatroonbackend.model.Room;
import org.springframework.data.domain.Page;

import java.util.List;

public interface RoomService {
    Page<Room> getMyRooms(String userId, int page, int size);

    Room createPrivateChat(String userId1, String userId2);

    Room createGroupChat(String createdBy, RoomCreationRequest roomCreationRequest);

    boolean isUserInRoom(String userId, String roomId);

    Room getRoomInfo(String userId, String roomId);
}
