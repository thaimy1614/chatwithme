package com.chatroomserver.chatroonbackend.controller;


import com.chatroomserver.chatroonbackend.dto.ApiResponse;
import com.chatroomserver.chatroonbackend.dto.response.MessageResponse;
import com.chatroomserver.chatroonbackend.model.Message;
import com.chatroomserver.chatroonbackend.service.message.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${application.api.prefix}/message")
public class MessageController {
    private final MessageService messageService;

    @GetMapping("/{roomId}/messages")
    ApiResponse<Page<Message>> getMessagesByRoom(
            @PathVariable String roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "createdAt") String key,
            JwtAuthenticationToken token
    ) {
        String userId = token.getName();
        Pageable pageable;
        if (key != null && !key.isEmpty()) {
            Sort sort = Sort.by(key).ascending();
            pageable = PageRequest.of(page, size, sort);
        } else {
            pageable = PageRequest.of(page, size);
        }

        Page<Message> response = messageService.getMessagesByRoom(roomId, userId, pageable);
        return ApiResponse.<Page<Message>>builder()
                .message("Get messages successfully!")
                .result(response).build();
    }
}
