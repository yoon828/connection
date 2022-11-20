package com.ssafy.connection.repository;

import com.ssafy.connection.dto.ProblemSearchInterface;
import com.ssafy.connection.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {

    @Query(value = "SELECT *  FROM problem WHERE accepted > 1000 AND level > 2", nativeQuery = true)
    List<Problem> findPopularProblemList();

    @Query(value = "SELECT * FROM problem WHERE upper(title) like %:title%", nativeQuery = true)
    List<Problem> findAllByTitle(String title);

    @Query(value = "SELECT * FROM problem JOIN tag ON tag.problem_id = problem.problem_id WHERE tag.ko = :ko", nativeQuery = true)
    List<Problem> findAllByTag(String ko);

    @Query(value = "SELECT * FROM problem p JOIN tag t ON p.problem_id = t.problem_id WHERE p.accepted > 10000 AND p.level > 2 AND t.ko = :tag", nativeQuery = true)
    List<Problem> findPopularProblemListByTag(String tag);

    @Query(value = "select p.problem_id problemId, p.title, p.accepted, p.level, p.tries, t.tag_id tagId, t.en, t.ko FROM problem p JOIN tag t ON p.problem_id = t.problem_id WHERE upper(title) like %:title%", nativeQuery = true)
    List<ProblemSearchInterface> findAllByTitle2(String title);

    @Query(value = "SELECT * FROM problem JOIN tag ON tag.problem_id = problem.problem_id WHERE tag.ko = :ko", nativeQuery = true)
    List<Problem> findAllByTag2(String ko);
}
