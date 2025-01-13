package com.chatroomserver.chatroonbackend.dto.call;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignalingMessage {
    private String type; // "offer", "answer", "candidate"
    private Object offer;
    private Object answer;
    private Object candidate;
}

