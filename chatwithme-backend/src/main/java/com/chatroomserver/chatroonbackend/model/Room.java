package com.chatroomserver.chatroonbackend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Document(collection = "rooms")
public class Room {
    @Id
    private String roomId;
    private String name;
    private boolean group;
    private List<String> members;
    private String createdBy;
    private Message lastMessage;
    private LocalDateTime createdAt = LocalDateTime.now();
    @LastModifiedDate
    private LocalDateTime lastModifiedAt;
}

