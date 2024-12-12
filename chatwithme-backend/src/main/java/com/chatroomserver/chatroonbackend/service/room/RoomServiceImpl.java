package com.chatroomserver.chatroonbackend.service.room;

import com.chatroomserver.chatroonbackend.dto.request.RoomCreationRequest;
import com.chatroomserver.chatroonbackend.mapper.RoomMapper;
import com.chatroomserver.chatroonbackend.model.Room;
import com.chatroomserver.chatroonbackend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService{
    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;

    public Page<Room> getMyRooms(String userId, int page, int size) {
        return roomRepository.findByMembersContaining(userId, PageRequest.of(page, size));
    }

    // Tạo phòng chat 1-1
    public Room createPrivateChat(String userId1, String userId2) {
        List<String> members = Arrays.asList(userId1, userId2);
        members.sort(String::compareTo);

        Optional<Room> existingChatRoom = roomRepository.findByMembersContainingAndGroup(members, false);

        return existingChatRoom.orElseGet(() -> {
            Room chatRoom = Room.builder()
                    .name(null)
                    .group(false)
                    .members(members)
                    .createdBy(userId1)
                    .createdAt(LocalDateTime.now())
                    .build();

            return roomRepository.save(chatRoom);
        });
    }

    public Room createGroupChat(String createdBy, RoomCreationRequest roomCreationRequest) {
        List<String> members = roomCreationRequest.getMembers();
        if (!members.contains(createdBy)) {
            members.add(createdBy);
        }

        Room chatRoom = roomMapper.toRoom(roomCreationRequest);
        chatRoom.setMembers(members);
        chatRoom.setGroup(true);
        chatRoom.setCreatedBy(createdBy);
        chatRoom.setCreatedAt(LocalDateTime.now());

        return roomRepository.save(chatRoom);
    }
}
