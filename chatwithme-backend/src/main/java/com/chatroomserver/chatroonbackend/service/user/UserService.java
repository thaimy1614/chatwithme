package com.chatroomserver.chatroonbackend.service.user;

import com.chatroomserver.chatroonbackend.dto.request.LoginRequest;
import com.chatroomserver.chatroonbackend.dto.response.LoginResponse;
import com.nimbusds.jose.JOSEException;

public interface UserService {
    LoginResponse authenticate(LoginRequest loginRequest) throws JOSEException;

    boolean introspect(String token);
}
