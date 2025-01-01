package com.chatroomserver.chatroonbackend.service.user;

import com.chatroomserver.chatroonbackend.dto.request.LoginRequest;
import com.chatroomserver.chatroonbackend.dto.request.RefreshTokenRequest;
import com.chatroomserver.chatroonbackend.dto.request.SignupRequest;
import com.chatroomserver.chatroonbackend.dto.request.UserRequest;
import com.chatroomserver.chatroonbackend.dto.response.LoginResponse;
import com.chatroomserver.chatroonbackend.dto.response.RefreshTokenResponse;
import com.chatroomserver.chatroonbackend.dto.response.SignupResponse;
import com.chatroomserver.chatroonbackend.dto.response.UserResponse;
import com.nimbusds.jose.JOSEException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.text.ParseException;
import java.util.List;

public interface UserService {
    LoginResponse authenticate(LoginRequest loginRequest) throws JOSEException;

    boolean introspect(String token);

    SignupResponse signup(SignupRequest signupRequest);

    void logout(String token) throws Exception;

    LoginResponse outboundAuthenticate(String code) throws JOSEException;

    UserResponse getMyInfo(String userId);

    UserResponse updateMyInfo(String userId, UserRequest userRequest);

    String getFullName(String userId);

    List<UserResponse> getAllUsers();

    Page<UserResponse> searchUsers(String key, Pageable pageable);

    RefreshTokenResponse refreshToken(RefreshTokenRequest request) throws ParseException, JOSEException;
}
