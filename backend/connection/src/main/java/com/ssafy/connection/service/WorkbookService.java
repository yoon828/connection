package com.ssafy.connection.service;

import com.ssafy.connection.dto.ProblemReturnDto;

import java.util.List;

public interface WorkbookService {

    void addProblem(Long problemId, Long userId);

    void deleteProblem(Long problemId, Long userId);

    List<ProblemReturnDto> getProblem(Long userId);
}
