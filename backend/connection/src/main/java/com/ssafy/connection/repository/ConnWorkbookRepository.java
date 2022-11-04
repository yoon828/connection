package com.ssafy.connection.repository;

import com.ssafy.connection.dto.WorkbookCountInterface;
import com.ssafy.connection.entity.ConnWorkbook;
import com.ssafy.connection.entity.Problem;
import com.ssafy.connection.entity.Workbook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConnWorkbookRepository extends JpaRepository<ConnWorkbook, Long> {
    int deleteByWorkbookAndProblem(Workbook workbookEnity, Problem problemEntity);

    List<ConnWorkbook> findAllByWorkbook(Workbook workbookEnity);

    List<ConnWorkbook> findAllByWorkbookAndProblem(Workbook workbookEnity, Problem problemEntity);

    @Query(value = "SELECT problem_id problemId, count(problem_id) count FROM conn_workbook GROUP BY problem_id", nativeQuery = true)
    List<WorkbookCountInterface> findGroupByProblem();

    void deleteAllByWorkbook(Workbook workbook);
}
