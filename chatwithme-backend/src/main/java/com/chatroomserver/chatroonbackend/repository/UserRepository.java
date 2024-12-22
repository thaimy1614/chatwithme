package com.chatroomserver.chatroonbackend.repository;

import com.chatroomserver.chatroonbackend.model.User;
import com.chatroomserver.chatroonbackend.model.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    List<User> findAllByStatus(UserStatus status);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Page<User> findByUsernameContainingIgnoreCase(String username, Pageable pageable);

    Page<User> findByFullNameContainingIgnoreCase(String fullName, Pageable pageable);
}
