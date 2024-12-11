package com.s_service.s_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least 3 characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least 8 characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    USERNAME_OR_PASSWORD_INCORRECT(1008, "Username or Password is incorrect", HttpStatus.BAD_REQUEST),
    INCORRECT_PASSWORD(1009, "Password is incorrect", HttpStatus.BAD_REQUEST),
    INCORRECT_OTP(1010, "OTP is incorrect", HttpStatus.BAD_REQUEST),
    INCORRECT_VERIFY_CODE(1011, "Cannot verify account", HttpStatus.BAD_REQUEST),
    SERVICE_NOT_FOUND(1012, "Service not found", HttpStatus.NOT_FOUND),
    CATEGORY_NOT_FOUND(1013, "Category not found", HttpStatus.NOT_FOUND),
    CATEGORY_EXISTED(1014, "Category existed", HttpStatus.NOT_FOUND),
    SERVICE_EXISTED(1015, "Service existed", HttpStatus.NOT_FOUND),
    UNVERIFIED_ACCOUNT(1016, "User not verified yet", HttpStatus.LOCKED),
    PROFILE_NOT_FOUND(1017, "Profile not found", HttpStatus.NOT_FOUND),
    ORDER_NOT_FOUND(1018, "Order not found", HttpStatus.NOT_FOUND),
    STAGE_NOT_FOUND(1019, "Stage not found", HttpStatus.NOT_FOUND),
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