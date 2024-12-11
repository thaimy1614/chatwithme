package com.chatroomserver.chatroonbackend.controller;

import com.chatroomserver.chatroonbackend.dto.ApiResponse;
import com.chatroomserver.chatroonbackend.dto.request.LoginRequest;
import com.chatroomserver.chatroonbackend.dto.request.LogoutRequest;
import com.chatroomserver.chatroonbackend.dto.request.SignupRequest;
import com.chatroomserver.chatroonbackend.dto.response.LoginResponse;
import com.chatroomserver.chatroonbackend.dto.response.SignupResponse;
import com.chatroomserver.chatroonbackend.dto.response.UserResponse;
import com.chatroomserver.chatroonbackend.service.user.UserService;
import com.nimbusds.jose.JOSEException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${application.api.prefix}")
public class UserController {
    private final UserService userService;

    @PostMapping("/outbound/authentication")
    ApiResponse<LoginResponse> outboundAuthenticate(
            @RequestParam("code") String code
    ) throws JOSEException {
        var result = userService.outboundAuthenticate(code);
        return ApiResponse.<LoginResponse>builder().message("Login with google successfully!").result(result).build();
    }

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

    @GetMapping("/log-out")
    ApiResponse<Object> logout(@RequestBody LogoutRequest request) throws Exception {
        userService.logout(request.getToken());
        return ApiResponse.builder().message("Logout successfully!").result(true).build();
    }

    @GetMapping("/my-info")
    ApiResponse<UserResponse> getMyInfo(JwtAuthenticationToken jwt){
        String userId = jwt.getName();
        UserResponse userResponse = userService.getMyInfo(userId);
        return ApiResponse.<UserResponse>builder()
                .message("Get info successfully!")
                .result(userResponse)
                .build();
    }

}
