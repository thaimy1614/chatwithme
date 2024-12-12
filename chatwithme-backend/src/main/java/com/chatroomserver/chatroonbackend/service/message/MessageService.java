package com.chatroomserver.chatroonbackend.service.message;

import com.chatroomserver.chatroonbackend.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MessageService {
    Page<Message> getMessagesByRoom(String roomId, String userId, Pageable pageable);
}
