package com.ssafy.connection.securityOauth.repository.user;

import com.ssafy.connection.securityOauth.domain.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long>{
    
    Optional<User> findByEmail(String email);
    Optional<User> findByGithubId(String githubId);
    Boolean existsByEmail(String email);

    User findByBackjoonId(String baekjoonId);
}
