package com.chatroomserver.chatroonbackend.service.chat;

import com.chatroomserver.chatroonbackend.dto.ChatMessage;

public interface ChatService {
    void saveMessage(String roomId, ChatMessage message);

    void sendMessage(String roomId, ChatMessage message);
}
