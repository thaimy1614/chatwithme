package com.chatroomserver.chatroonbackend.dto.call;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CallRequest {
    private String callerId;
    private String roomId;
}

