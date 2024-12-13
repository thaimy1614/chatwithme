package com.chatroomserver.chatroonbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {
    private String senderId;
    private String recipientId;
    private String roomId;
    private String content;
    private String media;
    private String mediaType;
    private LocalDateTime timestamp;
}
