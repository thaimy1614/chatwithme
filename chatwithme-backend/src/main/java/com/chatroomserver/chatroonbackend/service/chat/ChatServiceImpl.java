package com.chatroomserver.chatroonbackend.service.chat;

import com.chatroomserver.chatroonbackend.exception.AppException;
import com.chatroomserver.chatroonbackend.exception.ErrorCode;
import com.chatroomserver.chatroonbackend.mapper.MessageMapper;
import com.chatroomserver.chatroonbackend.model.Message;
import com.chatroomserver.chatroonbackend.model.Room;
import com.chatroomserver.chatroonbackend.repository.MessageRepository;
import com.chatroomserver.chatroonbackend.repository.RoomRepository;
import com.chatroomserver.chatroonbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements ChatService {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageRepository messageRepository;
    private final MessageMapper messageMapper;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    @Override
    @Async
    public void saveMessage(String roomId, Message message) {
        message.setRoomId(roomId);
        message.setMedia("");
        // TODO: store media in aws s3 then return a link
        messageRepository.save(message);

        Room room = roomRepository.findById(roomId).orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        room.setLastMessage(message);
        roomRepository.save(room);
    }


    @Override
    public void sendMessage(String roomId, Message message) {
        Room room = roomRepository.findById(roomId).orElseThrow(
                () -> new AppException(ErrorCode.ROOM_NOT_FOUND)
        );
        room.getMembers().forEach(member -> {
            if (!member.equals(message.getSenderId())) {
                log.info("send to" + member);
                simpMessagingTemplate.convertAndSendToUser(member, "/chat", message);
            }
        });
    }
}
