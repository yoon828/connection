package com.ssafy.connection.service;

import com.ssafy.connection.dto.ProblemDto;
import com.ssafy.connection.dto.ProblemReturnDto;

import java.util.List;

public interface ProblemService {

    List<ProblemReturnDto> getProblemList();

    void loadAllProblemFromApi();

    ProblemDto getProblem(long problemId);
}
