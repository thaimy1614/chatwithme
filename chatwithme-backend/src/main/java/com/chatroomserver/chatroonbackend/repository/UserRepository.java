package com.chatroomserver.chatroonbackend.repository;

import com.chatroomserver.chatroonbackend.model.User;
import com.chatroomserver.chatroonbackend.model.UserStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    List<User> findAllByStatus(UserStatus status);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

}
