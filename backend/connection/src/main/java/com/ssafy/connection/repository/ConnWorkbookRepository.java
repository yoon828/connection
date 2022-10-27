package com.ssafy.connection.repository;

import com.ssafy.connection.entity.ConnWorkbook;
import com.ssafy.connection.entity.Problem;
import com.ssafy.connection.entity.Workbook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConnWorkbookRepository extends JpaRepository<ConnWorkbook, Long> {
    void deleteByWorkbookAndProblem(Workbook workbookEnity, Problem problemEntity);

    List<ConnWorkbook> findAllByWorkbook(Workbook workbookEnity);
}
