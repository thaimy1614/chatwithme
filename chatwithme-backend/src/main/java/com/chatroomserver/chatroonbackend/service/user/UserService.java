package com.chatroomserver.chatroonbackend.service.user;

import com.chatroomserver.chatroonbackend.dto.request.LoginRequest;
import com.chatroomserver.chatroonbackend.dto.request.SignupRequest;
import com.chatroomserver.chatroonbackend.dto.response.LoginResponse;
import com.chatroomserver.chatroonbackend.dto.response.SignupResponse;
import com.chatroomserver.chatroonbackend.dto.response.UserResponse;
import com.nimbusds.jose.JOSEException;

import java.util.List;

public interface UserService {
    LoginResponse authenticate(LoginRequest loginRequest) throws JOSEException;

    boolean introspect(String token);

    SignupResponse signup(SignupRequest signupRequest);

    void logout(String token) throws Exception;

    LoginResponse outboundAuthenticate(String code) throws JOSEException;

    UserResponse getMyInfo(String userId);

    String getFullName(String userId);

    List<UserResponse> getAllUsers();
}
