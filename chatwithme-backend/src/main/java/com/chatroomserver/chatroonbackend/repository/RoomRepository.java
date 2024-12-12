package com.chatroomserver.chatroonbackend.repository;

import com.chatroomserver.chatroonbackend.model.ChatRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    Page<ChatRoom> findByMembersContaining(String userId, Pageable pageable);
}
