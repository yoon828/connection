package com.ssafy.connection.service;

import com.ssafy.connection.dto.ProblemReturnDto;

import java.util.List;

public interface WorkbookService {

    int addProblem(Long problemId, Long userId);

    int deleteProblem(Long problemId, Long userId);

    List<ProblemReturnDto> getProblem(Long userId);
}
