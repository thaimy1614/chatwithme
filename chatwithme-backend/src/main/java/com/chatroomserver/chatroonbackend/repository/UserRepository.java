package com.chatroomserver.chatroonbackend.repository;

import com.chatroomserver.chatroonbackend.model.User;
import com.chatroomserver.chatroonbackend.model.UserStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserRepository extends MongoRepository<User, String> {
    List<User> findAllByStatus(UserStatus status);
}
