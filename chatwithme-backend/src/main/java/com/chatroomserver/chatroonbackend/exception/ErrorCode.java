package com.chatroomserver.chatroonbackend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.OK),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.OK),
    USER_EXISTED(1002, "User existed", HttpStatus.OK),
    USERNAME_INVALID(1003, "Username must be at least 3 characters", HttpStatus.OK),
    INVALID_PASSWORD(1004, "Password must be at least 8 characters", HttpStatus.OK),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.OK),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.OK),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.OK),
    USERNAME_OR_PASSWORD_INCORRECT(1008, "Username or Password is incorrect", HttpStatus.OK),
    INCORRECT_PASSWORD(1009, "Password is incorrect", HttpStatus.OK),
    NOT_HAVE_PERMISSION(1111, "Do not have permission", HttpStatus.OK),
    ROOM_NOT_FOUND(1112, "Room not found", HttpStatus.OK),

    ;

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}