package com.ssafy.connection.repository;

import com.ssafy.connection.dto.StudyRankingInterface;
import com.ssafy.connection.entity.ConnStudy;
import com.ssafy.connection.entity.Study;
import com.ssafy.connection.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudyRepository extends JpaRepository<Study, Long> {
    Optional<Study> findByStudyCode(String studyCode);

    Optional<Study> findByStudyName(String studyName);

    Study findByConnStudy(ConnStudy connStudyEntity);

    @Query(value = "SELECT s.study_name AS studyName, s.study_id AS studyId, s.study_personnel AS studyPersonnel, s.study_score AS studyScore, s.homework_score AS homeworkScore, s.study_score+s.homework_score AS totalScore, s.study_repository AS studyRepository FROM study s ORDER BY s.study_score+s.homework_score desc;", nativeQuery = true)
    List<StudyRankingInterface> findStudyRanking();

}
