package com.chatroomserver.chatroonbackend.mapper;

import com.chatroomserver.chatroonbackend.dto.request.SignupRequest;
import com.chatroomserver.chatroonbackend.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(SignupRequest request);
}
