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
        Map<String, Object> signalingMessageMap = (Map<String, Object>) payload.get("signalingMessage");

        SignalingMessage signalingMessage = new SignalingMessage(
                (String) signalingMessageMap.get("type"),
                signalingMessageMap.get("offer"),
                signalingMessageMap.get("answer"),
                signalingMessageMap.get("candidate")
        );

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
                                "roomId", roomId,
                                "signalingMessage", signalingMessage
                        )
                );
            }
        });
    }


    @MessageMapping("/call/signaling/{roomId}")
    public void handleSignaling(@Payload Map<String, Object> payload,
                                @DestinationVariable String roomId) {
        String callerId = (String) payload.get("callerId"); // Lấy targetUserId từ payload
        SignalingMessage signalingMessage = new SignalingMessage(
                (String) payload.get("type"),
                payload.get("offer"),
                payload.get("answer"),
                payload.get("candidate")
        );

        Room room = roomRepository.findById(roomId).orElseThrow(
                () -> new AppException(ErrorCode.ROOM_NOT_FOUND)
        );

        room.getMembers().forEach(member -> {
            if (!member.equals(callerId)) {
                messagingTemplate.convertAndSendToUser(
                        member,
                        "/queue/call/signaling",
                        signalingMessage
                );
            }
        });
    }

    @MessageMapping("/call/candidate/{roomId}")
    public void handleCandidate(@Payload Map<String, Object> payload,
                                @DestinationVariable String roomId) {
        String callerId = (String) payload.get("callerId");
        String candidate = (String) payload.get("candidate");
        Room room = roomRepository.findById(roomId).orElseThrow(
                () -> new AppException(ErrorCode.ROOM_NOT_FOUND)
        );

        room.getMembers().forEach(member -> {
            if (!member.equals(callerId)) {
                messagingTemplate.convertAndSendToUser(
                        member,
                        "/queue/call/candidate",
                        Map.of("candidate", candidate)
                );
            }
        });
    }

    @MessageMapping("/call/reject/{roomId}")
    public void handleRejectCall(@Payload Map<String, Object> payload,
                                 @DestinationVariable String roomId) {
        String callerId = (String) payload.get("callerId");
        Room room = roomRepository.findById(roomId).orElseThrow(
                () -> new AppException(ErrorCode.ROOM_NOT_FOUND)
        );

        room.getMembers().forEach(member -> {
            if (!member.equals(callerId)) {
                messagingTemplate.convertAndSendToUser(
                        member,
                        "/queue/call/reject",
                        Map.of("message", "Call rejected")
                );
            }
        });
    }
}

