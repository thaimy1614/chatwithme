package com.chatroomserver.chatroonbackend.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "users")
@Builder
public class User {
    @Id
    private String userId;
    private String username;
    private String password;
    private String photoURL;
    private String email;
    private String fullName;
    private UserStatus status;
    @CreatedDate
    private LocalDateTime createdAt;
}
