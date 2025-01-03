package com.chatroomserver.chatroonbackend.service.chat;

import com.chatroomserver.chatroonbackend.model.Message;

public interface ChatService {
    void saveMessage(String roomId, Message message);

    void sendMessage(String roomId, Message message);
}
