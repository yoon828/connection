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

    List<Solve> findAllByUser(User user);

    @Query(value = "SELECT count(*) FROM study st JOIN subject su ON st.study_id = su.study_id LEFT JOIN solve so ON so.problem_id = su.problem_id WHERE so.user_id = :userId AND su.study_id = :studyId", nativeQuery = true)
    int countsolvedSubject(Long userId, Long studyId);

    @Query(value = "SELECT * FROM solve WHERE user_id = :userId AND status = 1", nativeQuery = true)
    List<Solve> findStudyProblemByUserId(long userId);

    @Query(value = "SELECT MID(s.time,1,10) date, COUNT(s.time) as cnt FROM solve s LEFT JOIN conn_study c ON s.user_id=c.user_id WHERE c.study_id =?1 GROUP BY date", nativeQuery = true)
    List<SolveStudyStatsInterface> findByStudyStreak(long studyId);
}
