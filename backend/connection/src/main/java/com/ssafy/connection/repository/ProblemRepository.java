package com.ssafy.connection.repository;

import com.ssafy.connection.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {

    @Query(value = "SELECT *  FROM problem WHERE accepted > 10000 AND level > 2", nativeQuery = true)
    List<Problem> findPopularProblemList();

    @Query(value = "SELECT * FROM problem WHERE upper(title) like %:title%", nativeQuery = true)
    List<Problem> findAllByTitle(String title);

    @Query(value = "SELECT * FROM problem JOIN tag ON tag.problem_id = problem.problem_id WHERE tag.ko = :ko", nativeQuery = true)
    List<Problem> findAllByTag(String ko);
}
