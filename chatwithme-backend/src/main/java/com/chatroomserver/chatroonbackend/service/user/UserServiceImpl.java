package com.chatroomserver.chatroonbackend.service.user;

import com.chatroomserver.chatroonbackend.dto.request.LoginRequest;
import com.chatroomserver.chatroonbackend.dto.response.LoginResponse;
import com.chatroomserver.chatroonbackend.exception.AppException;
import com.chatroomserver.chatroonbackend.exception.ErrorCode;
import com.chatroomserver.chatroonbackend.model.User;
import com.chatroomserver.chatroonbackend.repository.UserRepository;
import com.nimbusds.jose.JOSEException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse authenticate(LoginRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();
        User authUser;

            authUser = userRepository.findByUsername(username).orElseThrow(
                    () -> new AppException(ErrorCode.USER_NOT_EXISTED));


        boolean check = passwordEncoder.matches(password, authUser.getPassword());
        if (!check) {
            throw new AppException(ErrorCode.USERNAME_OR_PASSWORD_INCORRECT);
        }

        var token = generateToken(authUser);
        return LoginResponse.builder()
                .token(token)
                .role(authUser.getRoles().getRole())
                .build();
    }
}
