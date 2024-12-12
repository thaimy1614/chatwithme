package com.chatroomserver.chatroonbackend.repository;

import com.chatroomserver.chatroonbackend.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {

    Page<Message> findAllByRoomId(String chatId, Pageable pageable);
}
