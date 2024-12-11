package com.chatroomserver.chatroonbackend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document
public class User {
    @Id
    private String userId;
    private String username;
    private String password;
    private String fullName;
    private UserStatus status;
}
