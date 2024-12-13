package com.chatroomserver.chatroonbackend.mapper;

import com.chatroomserver.chatroonbackend.dto.ChatMessage;
import com.chatroomserver.chatroonbackend.model.Message;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MessageMapper {
    Message toMessage(ChatMessage chatMessage);
}
