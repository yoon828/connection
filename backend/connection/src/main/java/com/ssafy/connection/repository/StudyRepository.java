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

    @Query(value = "SELECT s.study_name AS studyName, c.study_id AS studyId, s.study_repository AS studyRepository, SUM(c.study_score) AS studyScore, SUM(c.subject_score) AS subjectScore, SUM(c.bonus_score) AS bonusScore, SUM(c.study_score+c.subject_score+c.bonus_score) AS totalScore FROM conn_study c LEFT JOIN study s ON c.study_id=s.study_id GROUP BY c.study_id ORDER BY totalScore DESC, studyName;", nativeQuery = true)
    List<StudyRankingInterface> findStudyRanking();

}
