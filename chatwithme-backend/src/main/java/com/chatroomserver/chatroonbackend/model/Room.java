package com.chatroomserver.chatroonbackend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Document(collection = "chat_rooms")
public class ChatRoom {
    @Id
    private String id;
    private String name;
    private boolean isGroup;
    private List<String> members;
    private String createdBy;
    private LocalDateTime createdAt = LocalDateTime.now();
}

