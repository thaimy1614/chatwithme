package com.chatroomserver.chatroonbackend.service.message;

import com.chatroomserver.chatroonbackend.exception.AppException;
import com.chatroomserver.chatroonbackend.exception.ErrorCode;
import com.chatroomserver.chatroonbackend.model.Message;
import com.chatroomserver.chatroonbackend.model.Room;
import com.chatroomserver.chatroonbackend.repository.MessageRepository;
import com.chatroomserver.chatroonbackend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {
    private final RoomRepository roomRepository;
    private final MessageRepository messageRepository;

    @Override
    public Page<Message> getMessagesByRoom(String roomId, String userId, Pageable pageable) {
        Room room = roomRepository.findById(roomId).orElseThrow(
                () -> new AppException(ErrorCode.ROOM_NOT_FOUND)
        );

        List<String> members = room.getMembers();
        if (!members.contains(userId)) {
            throw new AppException(ErrorCode.NOT_HAVE_PERMISSION);
        }

        return messageRepository.findAllByRoomId(roomId, pageable);
    }
}
