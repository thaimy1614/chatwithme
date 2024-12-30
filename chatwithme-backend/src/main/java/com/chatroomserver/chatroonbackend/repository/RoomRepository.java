package com.chatroomserver.chatroonbackend.repository;

import com.chatroomserver.chatroonbackend.model.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface RoomRepository extends MongoRepository<Room, String> {
    Page<Room> findByMembersContainingOrderByLastModifiedAtDesc(String userId, Pageable pageable);

    Optional<Room> findByMembersEqualsAndGroup(List<String> members, boolean group);

}
