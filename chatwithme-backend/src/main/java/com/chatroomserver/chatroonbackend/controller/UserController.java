package com.chatroomserver.chatroonbackend.controller;

import com.chatroomserver.chatroonbackend.dto.ApiResponse;
import com.chatroomserver.chatroonbackend.dto.request.LoginRequest;
import com.chatroomserver.chatroonbackend.dto.request.SignupRequest;
import com.chatroomserver.chatroonbackend.dto.response.LoginResponse;
import com.chatroomserver.chatroonbackend.dto.response.SignupResponse;
import com.chatroomserver.chatroonbackend.service.user.UserService;
import com.nimbusds.jose.JOSEException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}")
public class UserController {
    private final UserService userService;

    @PostMapping("/login")
    ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) throws Exception {
        var auth = userService.authenticate(request);
        return ApiResponse.<LoginResponse>builder()
                .message("Login successfully!")
                .result(auth)
                .build();
    }

    @PostMapping("/signup")
    ApiResponse<SignupResponse> signup(@RequestBody SignupRequest request) {
        SignupResponse response = userService.signup(request);
        return ApiResponse.<SignupResponse>builder()
                .message("Signup successfully, please go to email to verify your email address.")
                .result(response)
                .build();
    }

}
