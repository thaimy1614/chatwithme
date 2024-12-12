package com.chatroomserver.chatroonbackend.mapper;

import com.chatroomserver.chatroonbackend.dto.request.RoomCreationRequest;
import com.chatroomserver.chatroonbackend.model.Room;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoomMapper {
    Room toRoom(RoomCreationRequest roomCreationRequest);
}
