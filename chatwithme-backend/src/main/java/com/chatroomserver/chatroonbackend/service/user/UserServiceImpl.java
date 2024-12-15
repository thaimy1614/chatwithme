package com.chatroomserver.chatroonbackend.service.user;

import com.chatroomserver.chatroonbackend.dto.request.ExchangeTokenRequest;
import com.chatroomserver.chatroonbackend.dto.request.LoginRequest;
import com.chatroomserver.chatroonbackend.dto.request.SignupRequest;
import com.chatroomserver.chatroonbackend.dto.response.LoginResponse;
import com.chatroomserver.chatroonbackend.dto.response.SignupResponse;
import com.chatroomserver.chatroonbackend.dto.response.UserResponse;
import com.chatroomserver.chatroonbackend.exception.AppException;
import com.chatroomserver.chatroonbackend.exception.ErrorCode;
import com.chatroomserver.chatroonbackend.httpclient.OutboundIdentityClient;
import com.chatroomserver.chatroonbackend.httpclient.OutboundUserClient;
import com.chatroomserver.chatroonbackend.mapper.UserMapper;
import com.chatroomserver.chatroonbackend.model.User;
import com.chatroomserver.chatroonbackend.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    @NonFinal
    protected final String GRANT_TYPE = "authorization_code";
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RedisTemplate<String, String> redisTemplate;
    private final UserMapper userMapper;
    private final OutboundIdentityClient outboundIdentityClient;
    private final OutboundUserClient outboundUserClient;
    @NonFinal
    @Value("${outbound.identity.client-id}")
    protected String CLIENT_ID;
    @NonFinal
    @Value("${outbound.identity.client-secret}")
    protected String CLIENT_SECRET;
    @NonFinal
    @Value("${outbound.identity.redirect-uri}")
    protected String REDIRECT_URI;
    @Value("${application.api.url}")
    private String apiUrl;
    @Value("${jwt.signer-key}")
    private String KEY;
    @Value("${jwt.expiration-duration}")
    private long EXPIRATION_DURATION;
    @Value("${jwt.refreshable-duration}")
    private String REFRESHABLE_DURATION;

    public String getFullName(String userId) {
        return userRepository.findById(userId).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED)).getFullName();
    }

    public LoginResponse authenticate(LoginRequest request) throws JOSEException {
        String username = request.getUsername();
        String password = request.getPassword();


        User authUser = userRepository.findByUsername(username).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));


        boolean check = passwordEncoder.matches(password, authUser.getPassword());
        if (!check) {
            throw new AppException(ErrorCode.USERNAME_OR_PASSWORD_INCORRECT);
        }

        var token = generateToken(authUser);
        return LoginResponse.builder()
                .token(token)
                .username(username)
                .build();
    }

    private String generateToken(User user) throws JOSEException {
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet
                .Builder()
                .subject(user.getUserId())
                .issuer("Thaidq")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(EXPIRATION_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(jwsHeader, payload);
        jwsObject.sign(new MACSigner(KEY));
        return jwsObject.serialize();
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws Exception {
        JWSVerifier verifier = new MACVerifier(KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expiryTime = (isRefresh) ? new Date(signedJWT.getJWTClaimsSet().getIssueTime().toInstant().plus(Long.parseLong(REFRESHABLE_DURATION), ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();
        var verified = signedJWT.verify(verifier);
        if (!(verified && expiryTime.after(new Date()))) {
            throw new Exception("UNAUTHENTICATED");
        }

        if (isTokenInBlacklist(signedJWT.getJWTClaimsSet().getJWTID())) {
            throw new Exception("UNAUTHENTICATED");
        }
        return signedJWT;
    }

    public boolean introspect(String token) {
        boolean isValid = true;
        try {
            verifyToken(token, false);
        } catch (Exception e) {
            isValid = false;
        }
        return isValid;
    }

    private boolean isTokenInBlacklist(String jwtId) {
        return redisTemplate.opsForValue().get("bl_" + jwtId) != null;
    }

    public SignupResponse signup(SignupRequest request) {
        userRepository.findByUsername(request.getUsername())
                .ifPresent(ex -> {
                    throw new AppException(ErrorCode.USER_EXISTED);
                });
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        return SignupResponse.builder().success(true).build();
    }

    private void addTokenToBlacklist(String jwtId, Date expiryTime) {
        redisTemplate.opsForValue().set("bl_" + jwtId, jwtId);
        redisTemplate.expireAt("bl_" + jwtId, expiryTime);
    }

    public void logout(String token) throws Exception {
        var signedJWT = verifyToken(token, true);
        String jId = signedJWT.getJWTClaimsSet().getJWTID();
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        addTokenToBlacklist(jId, expiryTime);
    }

    public LoginResponse outboundAuthenticate(String code) throws JOSEException {
        var response = outboundIdentityClient.exchangeToken(ExchangeTokenRequest.builder()
                .code(code)
                .clientId(CLIENT_ID)
                .clientSecret(CLIENT_SECRET)
                .redirectUri(REDIRECT_URI)
                .grantType(GRANT_TYPE)
                .build());
        log.info("TOKEN RESPONSE {}", response);

        var userInfo = outboundUserClient.getUserInfo("json", response.getAccessToken());

        log.info("User Info {}", userInfo);

        var user = userRepository.findByEmail(userInfo.getEmail()).orElseGet(
                () -> {
                    return userRepository.<User>save(User.builder()
                            .email(userInfo.getEmail())
                            .fullName(userInfo.getGivenName() + userInfo.getFamilyName())
                            .build());

                });
        var token = generateToken(user);

        return LoginResponse.builder()
                .token(token)
                .username(user.getUsername())
                .build();
    }

    public UserResponse getMyInfo(String userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED)
        );

        return UserResponse.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .build();
    }

    public List<UserResponse> getAllUsers(){
        List<User> users = userRepository.findAll();
        return users.stream().map(userMapper::toUserResponse).toList();
    }
}
