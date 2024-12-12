package com.chatroomserver.chatroonbackend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomCreationRequest {
    private String name;
    private List<String> members;
}
