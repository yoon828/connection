package com.ssafy.connection.service;

import com.ssafy.connection.dto.ProblemDto;
import com.ssafy.connection.dto.ProblemTagDto;
import com.ssafy.connection.entity.Problem;

import java.util.List;

public interface ProblemService {
    void save(Problem problem);

    List<ProblemTagDto> getProblemList();

    void loadAllProblemFromApi();
}
