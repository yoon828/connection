package com.ssafy.connection.repository;

import com.ssafy.connection.entity.Problem;
import com.ssafy.connection.entity.Solve;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SolveRepository extends JpaRepository<Solve, Long> {
    Optional<Solve> findByUserAndProblem(User user, Problem problem);
}
