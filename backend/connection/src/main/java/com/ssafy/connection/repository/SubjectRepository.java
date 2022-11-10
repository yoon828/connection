package com.ssafy.connection.repository;

import com.ssafy.connection.dto.GetDateAndCountInterface;
import com.ssafy.connection.entity.Problem;
import com.ssafy.connection.entity.Study;
import com.ssafy.connection.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findAllByStudy(Study studyEntity);
    List<Subject> findAllByStudyAndDeadlineAfter(Study studyEntity, LocalDateTime localDateTime);

    void deleteAllByStudy(Study study);

    @Query(value = "select a.user_id, a.name, a.problem_id, a.title, COUNT(solve_id) as solve, a.deadline, a.start\n" +
            "from (select u.user_id, u.name, s.problem_id, s.deadline , p.title, s.start \n" +
            "\tfrom user u, conn_study cs, subject s, problem p\n" +
            "\twhere u.user_id = cs.user_id\n" +
            "\t\t\tand cs.study_id = s.study_id\n" +
            "\t\t\tand cs.study_id = ?1\n" +
            "\t\t\tand s.problem_id = p.problem_id) a \n" +
            "\tleft join solve sv \n" +
            "\ton a.user_id = sv.user_id \n" +
            "\t\tand a.problem_id = sv.problem_id\n" +
            "and sv.status = 0 AND sv.time BETWEEN a.start and a.deadline \n" +
            "group by a.user_id, a.problem_id\n" +
            "order by a.deadline, a.problem_id, a.user_id;", nativeQuery = true)
    List<Object[]> getTeamStatus(long studyId);

    @Query(value = "select count(s.subjcet_id) from subject s where s.study_id =?1 group by s.deadline order by deadline desc;", nativeQuery = true)
    List<Long> getTeamSubjectCount(long studyId);

    @Query(value = "select * from subject where study_id = :studyId order by deadline desc limit 4", nativeQuery = true)
    List<Subject> findAllByStudyDesc(long studyId);

    @Query(value = "SELECT DATE_FORMAT(s.deadline, '%Y-%m-01') AS date, COUNT(s.deadline) AS count FROM subject s WHERE s.study_id =?1 AND s.deadline BETWEEN DATE_ADD(DATE_ADD(NOW(), INTERVAL -5 MONTH), INTERVAL -DAY(NOW()) DAY) AND NOW() GROUP BY DATE;", nativeQuery = true)
    List<GetDateAndCountInterface> findStudySubject(long studyId);

    @Query(value = "SELECT * FROM subject where study_id = :studyId AND problem_id = :problemId ORDER BY deadline desc", nativeQuery = true)
    List<Subject> findAllByStudyAndProblemOrderByDeadLine(long studyId, Long problemId);

    boolean existsByProblemIn(List<Problem> efd);
}
