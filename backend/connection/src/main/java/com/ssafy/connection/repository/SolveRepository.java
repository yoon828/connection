package com.ssafy.connection.repository;

import com.ssafy.connection.dto.SolveStudyMemberStatsInterface;
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

    @Query(value = "SELECT count(*) FROM study st JOIN subject su ON st.study_id = su.study_id LEFT JOIN solve so ON so.problem_id = su.problem_id WHERE so.user_id = :userId AND su.study_id = :studyId AND so.status = 0", nativeQuery = true)
    int countsolvedSubject(Long userId, Long studyId);

    @Query(value = "SELECT * FROM solve WHERE user_id = :userId AND status = 1", nativeQuery = true)
    List<Solve> findStudyProblemByUserId(long userId);

    @Query(value = "SELECT MID(s.time,1,10) AS date, COUNT(s.time) as count FROM solve s LEFT JOIN conn_study c ON s.user_id=c.user_id WHERE c.study_id =?1 AND s.time BETWEEN DATE_ADD(NOW(), INTERVAL -180 DAY) AND NOW() GROUP BY date;", nativeQuery = true)
    List<SolveStudyStatsInterface> findByStudyStreak(long studyId);

    List<Solve> findAllByUser_UserId(Long userId);

    @Query(value = "SELECT DATE_FORMAT(s.time, '%Y-%m-01') AS date, COUNT(s.time) AS count FROM solve s LEFT JOIN conn_study c ON s.user_id=c.user_id WHERE c.study_id =?1 AND c.user_id =?2 AND s.time BETWEEN  DATE_ADD(DATE_ADD(NOW(), INTERVAL -5 MONTH), INTERVAL -DAY(NOW()) DAY) AND NOW() GROUP BY date;", nativeQuery = true)
    List<SolveStudyMemberStatsInterface> findStudyMember(long studyId, long userId);

    void deleteAllByUser(User user);

    @Query(value = "SELECT DATE_FORMAT(s.time,'%Y-%m-01') AS date, COUNT(DISTINCT s.problem_id) as count  FROM solve s LEFT OUTER JOIN conn_study c ON s.user_id=c.user_id WHERE c.study_id=?1 AND s.status =1 AND s.time BETWEEN DATE_ADD(DATE_ADD(NOW(), INTERVAL -5 MONTH), INTERVAL -DAY(NOW()) DAY) AND NOW() GROUP BY date;", nativeQuery = true) // 스터디에서 함께 푼 문제
    List<SolveStudyMemberStatsInterface> findStudyProblem(long studyId);
}
