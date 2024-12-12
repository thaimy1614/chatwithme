package com.chatroomserver.chatroonbackend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoomResponse {
    private String roomId;
}
