package com.ssafy.connection.repository;

import com.ssafy.connection.entity.ConnStudy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConnStudyRepository extends JpaRepository<ConnStudy, Long> {
    Optional<ConnStudy> findByStudy_studyId(long studyId);
}
