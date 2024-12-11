package com.chatroomserver.chatroonbackend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SignupResponse {
    private boolean success;
}
