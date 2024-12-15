package com.chatroomserver.chatroonbackend.controller;

import com.chatroomserver.chatroonbackend.dto.ChatMessage;
import com.chatroomserver.chatroonbackend.model.Message;
import com.chatroomserver.chatroonbackend.service.chat.ChatService;
import com.chatroomserver.chatroonbackend.service.room.RoomService;
import com.chatroomserver.chatroonbackend.service.user.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.support.ErrorMessage;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@Slf4j
public class ChatController {
    private final RoomService roomService;
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;

    @MessageMapping("/chat/{roomId}")
    public void sendMessageToRoom(@DestinationVariable String roomId, Message message) {
        if (roomService.isUserInRoom(message.getSenderId(), roomId)) {
            message.setSenderName(userService.getFullName(message.getSenderId()));
            chatService.saveMessage(roomId, message);
            chatService.sendMessage(roomId, message);
        } else {
            messagingTemplate.convertAndSendToUser(message.getSenderId(),"/chat", new ErrorMessage(new Throwable("Bạn không có quyền gửi!")));
        }
    }

}