package com.chatroomserver.chatroonbackend.service.chat;

import com.chatroomserver.chatroonbackend.dto.ChatMessage;
import com.chatroomserver.chatroonbackend.exception.AppException;
import com.chatroomserver.chatroonbackend.exception.ErrorCode;
import com.chatroomserver.chatroonbackend.mapper.MessageMapper;
import com.chatroomserver.chatroonbackend.model.Room;
import com.chatroomserver.chatroonbackend.repository.MessageRepository;
import com.chatroomserver.chatroonbackend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageRepository messageRepository;
    private final MessageMapper messageMapper;
    private final RoomRepository roomRepository;

    @Override
    public void saveMessage(String roomId, ChatMessage message) {
        message.setRoomId(roomId);
        // TODO: store media in aws s3 then return a link
        messageRepository.save(messageMapper.toMessage(message));
    }

    @Override
    public void sendMessage(String roomId, ChatMessage message) {
        Room room = roomRepository.findById(roomId).orElseThrow(
                () -> new AppException(ErrorCode.ROOM_NOT_FOUND)
        );
        room.getMembers().forEach(member -> {
            if(!member.equals(message.getSenderId())){
                simpMessagingTemplate.convertAndSendToUser(member, "/chat", message);
            }
        });
    }
}
