package com.ssafy.connection.repository;

import com.ssafy.connection.entity.ConnStudy;
import com.ssafy.connection.entity.Study;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConnStudyRepository extends JpaRepository<ConnStudy, Long> {
    void deleteAllByStudy(Study study);
    Optional<ConnStudy> findByStudy_StudyIdAndRole(long studyId, String role);
    Optional<ConnStudy> findByUser_UserId(long userId);
    ConnStudy findByUser(User userEntity);
    List<ConnStudy> findAllByStudy_StudyId(long studyId);
    Optional<ConnStudy> findByUser_UserIdAndStudy_StudyId(long userId, long studyId);
    Optional<ConnStudy> findByUser_UserIdAndRole(long studyId, String role);
    Optional<ConnStudy>findByUser_UserIdAndStudy_StudyIdAndRole(long userId, long studyId, String role);
}
