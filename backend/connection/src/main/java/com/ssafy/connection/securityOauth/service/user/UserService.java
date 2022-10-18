package com.ssafy.connection.securityOauth.service.user;

import com.ssafy.connection.securityOauth.advice.assertThat.DefaultAssert;
import com.ssafy.connection.securityOauth.config.security.token.UserPrincipal;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import com.ssafy.connection.securityOauth.payload.response.ApiResponse;
import com.ssafy.connection.securityOauth.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;

    public ResponseEntity<?> readByUser(UserPrincipal userPrincipal){
        Optional<User> user = userRepository.findById(userPrincipal.getId());
        DefaultAssert.isOptionalPresent(user);
        ApiResponse apiResponse = ApiResponse.builder().check(true).information(user.get()).build();
        return ResponseEntity.ok(apiResponse);
    }
}
