package com.chatroomserver.chatroonbackend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private String userId;
    private String fullName;
}
