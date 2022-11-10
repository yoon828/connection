package com.ssafy.connection.repository;

import com.ssafy.connection.dto.GetDateAndCountFloatInterface;
import com.ssafy.connection.dto.GetDateAndCountInterface;
import com.ssafy.connection.dto.SolveStudyInterface;
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

    Optional<List<Solve>> findAllByUser(User user);

    @Query(value = "SELECT count(*) FROM study st JOIN subject su ON st.study_id = su.study_id LEFT JOIN solve so ON so.problem_id = su.problem_id WHERE so.user_id = :userId AND su.study_id = :studyId AND so.status = 0", nativeQuery = true)
    int countsolvedSubject(Long userId, Long studyId);

    @Query(value = "SELECT * FROM solve WHERE user_id = :userId AND status = 1", nativeQuery = true)
    List<Solve> findStudyProblemByUserId(long userId);

    @Query(value = "SELECT MID(s.time,1,10) AS date, COUNT(DISTINCT s.user_id) as count FROM solve s LEFT JOIN conn_study c ON s.user_id=c.user_id WHERE c.study_id =?1 AND s.status IN (0,1) AND s.time BETWEEN DATE_ADD(NOW(), INTERVAL -180 DAY) AND NOW() GROUP BY date;", nativeQuery = true)
    List<SolveStudyInterface> findStudyStreakByStudyId(long studyId);

    List<Solve> findAllByUser_UserId(Long userId);

    @Query(value = "SELECT DATE_FORMAT(s.time, '%Y-%m-01') AS date, COUNT(s.time) AS count FROM solve s LEFT JOIN conn_study c ON s.user_id=c.user_id WHERE c.study_id =?1 AND c.user_id =?2 AND s.status IN (0,1) AND s.time BETWEEN  DATE_ADD(DATE_ADD(NOW(), INTERVAL -5 MONTH), INTERVAL -DAY(NOW()) DAY) AND NOW() GROUP BY date;", nativeQuery = true)
    List<GetDateAndCountInterface> findStudyMemberRecordByStudyIdAndUserId(long studyId, long userId);

    void deleteAllByUser(User user);

    @Query(value = "SELECT DATE_FORMAT(s.time,'%Y-%m-01') AS date, COUNT(DISTINCT s.problem_id) as count  FROM solve s LEFT OUTER JOIN conn_study c ON s.user_id=c.user_id WHERE c.study_id=?1 AND s.status =1 AND s.time BETWEEN DATE_ADD(DATE_ADD(NOW(), INTERVAL -5 MONTH), INTERVAL -DAY(NOW()) DAY) AND NOW() GROUP BY date;", nativeQuery = true)
    List<GetDateAndCountInterface> findStudyProblemByStudyId(long studyId); // 스터디에서 함께 푼 문제

    @Query(value = "SELECT * FROM solve WHERE user_id = :userId AND problem_id = :problemId AND status = 2", nativeQuery = true)
    Optional<Solve> findNormalByUserAndProblem(Long userId, Long problemId);

    @Query(value = "SELECT * FROM solve WHERE user_id = :userId AND problem_id = :problemId AND status = 0", nativeQuery = true)
    Optional<Solve> findSubjectByUserAndProblem(long userId, long problemId);

    @Query(value = "SELECT * FROM solve WHERE user_id = :userId AND problem_id = :problemId AND status = 1", nativeQuery = true)
    Optional<Solve> findStudyByUserAndProblem(long userId, long problemId);

    @Query(value = "SELECT res.time AS date, COUNT(*)/res.cnt AS count FROM (SELECT ss.status AS status, DATE_FORMAT(ss.time, '%Y-%m-01') AS time, ss.problem_id AS problem_id, ss.user_id AS user_id, ss.cnt AS cnt FROM (SELECT s.status AS status, MAX(s.time) AS time, s.problem_id AS problem_id, s.user_id AS user_id, (SELECT COUNT(*) FROM conn_study WHERE study_id =?1) AS cnt FROM solve s GROUP BY s.user_id, s.problem_id) AS ss LEFT JOIN conn_study cc ON ss.user_id=cc.user_id WHERE cc.study_id=?1 AND ss.status IN (0,1) AND ss.time BETWEEN DATE_ADD(DATE_ADD(NOW(), INTERVAL -5 MONTH), INTERVAL -DAY(NOW()) DAY) AND NOW()) AS res GROUP BY date;", nativeQuery = true)
    List<GetDateAndCountFloatInterface> findStudyAvgSolveByStudyId(long studyId); // 월별 스터디 해결 문제 평균 갯수

    @Query(value = "SELECT * FROM solve WHERE user_id = :userId AND (status = 0 OR status = 1)", nativeQuery = true)
    List<Solve> findUncommonSolveByUserId(long userId);
}
