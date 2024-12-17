package com.chatroomserver.chatroonbackend.controller;

import com.chatroomserver.chatroonbackend.dto.ApiResponse;
import com.chatroomserver.chatroonbackend.dto.request.RoomCreationRequest;
import com.chatroomserver.chatroonbackend.model.Room;
import com.chatroomserver.chatroonbackend.service.room.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${application.api.prefix}/room")
public class RoomController {
    private final RoomService roomService;

    @GetMapping("/my-rooms")
    ApiResponse<Page<Room>> getMyRooms(
            JwtAuthenticationToken token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        String userId = token.getName();
        Page<Room> response = roomService.getMyRooms(userId, page, size);
        return ApiResponse.<Page<Room>>builder()
                .message("Get rooms successfully!")
                .result(response)
                .build();
    }

    @GetMapping("/{roomId}")
    ApiResponse<Room> getMyRooms(
            @PathVariable String roomId,
                    JwtAuthenticationToken token
            ) {
        String userId = token.getName();
        Room response = roomService.getRoomInfo(userId, roomId);
        return ApiResponse.<Room>builder()
                .message("Get rooms successfully!")
                .result(response)
                .build();
    }

    @PostMapping("/private")
    ApiResponse<Room> createPrivateChat(JwtAuthenticationToken token, @RequestParam String userId2) {
        String userId1 = token.getName();
        Room chatRoom = roomService.createPrivateChat(userId1, userId2);
        return ApiResponse.<Room>builder()
                .message("Private chat successfully!")
                .result(chatRoom)
                .build();
    }

    @PostMapping("/group")
    public ApiResponse<Room> createGroupChat(
            JwtAuthenticationToken token,
            @RequestBody RoomCreationRequest roomCreationRequest
    ) {
        String userId = token.getName();
        Room chatRoom = roomService.createGroupChat(userId, roomCreationRequest);
        return ApiResponse.<Room>builder()
                .message("Group chat successfully!")
                .result(chatRoom)
                .build();
    }
}
