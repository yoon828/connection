package com.ssafy.connection.repository;

import com.ssafy.connection.entity.ConnStudy;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConnStudyRepository extends JpaRepository<ConnStudy, Long> {
    Optional<ConnStudy> findByStudy_StudyId(long studyId);
    Optional<ConnStudy> findByUser_UserId(long userId);

    List<ConnStudy> findAllByStudy_StudyId(long studyId);
}
