package com.chatroomserver.chatroonbackend.controller;

import com.chatroomserver.chatroonbackend.dto.call.SignalingMessage;
import com.chatroomserver.chatroonbackend.exception.AppException;
import com.chatroomserver.chatroonbackend.exception.ErrorCode;
import com.chatroomserver.chatroonbackend.model.Room;
import com.chatroomserver.chatroonbackend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class CallController {
    private final SimpMessagingTemplate messagingTemplate;
    private final RoomRepository roomRepository;

    @MessageMapping("/call/request/{roomId}")
    public void handleCallRequest(@Payload Map<String, Object> payload,
                                  @DestinationVariable String roomId) {
        String callerId = (String) payload.get("callerId");
        String callerName = (String) payload.get("callerName");

        Room room = roomRepository.findById(roomId).orElseThrow(
                () -> new AppException(ErrorCode.ROOM_NOT_FOUND)
        );

        room.getMembers().forEach(member -> {
            if (!member.equals(callerId)) {
                messagingTemplate.convertAndSendToUser(
                        member,
                        "/queue/call/request",
                        Map.of(
                                "callerId", callerId,
                                "callerName", callerName,
                                "roomId", roomId
                        )
                );
            }
        });
    }
}

