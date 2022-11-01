package com.ssafy.connection.repository;

import com.ssafy.connection.dto.SolveStudyStatsInterface;
import com.ssafy.connection.entity.Problem;
import com.ssafy.connection.entity.Solve;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolveRepository extends JpaRepository<Solve, Long> {
    Optional<Solve> findByUserAndProblem(User user, Problem problem);

    @Query(value = "SELECT MID(s.time,1,10) date, COUNT(s.time) as cnt FROM solve s LEFT JOIN conn_study c ON s.user_id=c.user_id WHERE c.study_id =?1 GROUP BY date", nativeQuery = true)
    List<SolveStudyStatsInterface> findByStudyStreak(long studyId);
}
