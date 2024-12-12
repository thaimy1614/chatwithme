package com.chatroomserver.chatroonbackend.controller;

import com.chatroomserver.chatroonbackend.dto.ApiResponse;
import com.chatroomserver.chatroonbackend.model.Room;
import com.chatroomserver.chatroonbackend.service.room.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("${application.api.prefix}/room")
public class RoomController {
    private final RoomService roomService;

    @GetMapping("/my-room")
    ApiResponse<Page<Room>> getMyRooms(
            JwtAuthenticationToken token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        String userId = token.getName();
        Page<Room> response = roomService.getMyRooms(userId, page, size);
        return ApiResponse.<Page<Room>>builder()
                .message("Get rooms successfully!")
                .result(response)
                .build();
    }
}
