package com.ssafy.connection.repository;

import com.ssafy.connection.entity.Study;
import com.ssafy.connection.entity.Workbook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkbookRepository extends JpaRepository<Workbook, Long> {
    Workbook findByStudy(Study studyEntity);
    void deleteAllByStudy(Study study);
}
