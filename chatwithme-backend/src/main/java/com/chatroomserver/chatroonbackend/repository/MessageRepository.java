package com.chatroomserver.chatroonbackend.repository;

import com.chatroomserver.chatroonbackend.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

    List<ChatMessage> findAllByChatId(String chatId);
}
