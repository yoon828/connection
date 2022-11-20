package com.ssafy.connection.repository;

import com.ssafy.connection.entity.Study;
import com.ssafy.connection.entity.Workbook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkbookRepository extends JpaRepository<Workbook, Long> {
    Optional<Workbook> findByStudy(Study studyEntity);
    void deleteAllByStudy(Study study);
}
