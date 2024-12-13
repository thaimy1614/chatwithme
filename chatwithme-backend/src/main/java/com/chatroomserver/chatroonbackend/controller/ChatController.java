package com.chatroomserver.chatroonbackend.controller;

import com.chatroomserver.chatroonbackend.dto.ChatMessage;
import com.chatroomserver.chatroonbackend.service.chat.ChatService;
import com.chatroomserver.chatroonbackend.service.room.RoomService;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.support.ErrorMessage;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class ChatController {
    private final RoomService roomService;
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{roomId}")
    public void sendMessageToRoom(@DestinationVariable String roomId, ChatMessage message) {
        if (roomService.isUserInRoom(message.getSenderId(), roomId)) {
            chatService.saveMessage(roomId, message);
            chatService.sendMessage(roomId, message);
        } else {
            messagingTemplate.convertAndSendToUser(message.getSenderId(),"/chat", new ErrorMessage(new Throwable("Bạn không có quyền gửi!")));
        }
    }

}