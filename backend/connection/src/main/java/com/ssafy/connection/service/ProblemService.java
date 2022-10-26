package com.ssafy.connection.service;

import com.ssafy.connection.dto.ProblemDto;
import com.ssafy.connection.dto.ProblemReturnDto;
import com.ssafy.connection.entity.Problem;

import java.util.List;

public interface ProblemService {

    List<ProblemReturnDto> getProblemList();

    void loadAllProblemFromApi();

    List<ProblemReturnDto> getSolvedProblemList(String baekjoonId);

    Object getPopularProblemList(long level, String tag);

    Object getWorkBookProblemList(long level, String tag);

    Object getPopularProblemList(String tag);

    Object getPopularProblemList(Long level);

    Object getPopularProblemList();

    List<ProblemReturnDto> getProblem(String title);

    List<ProblemReturnDto> getProblem(long problemId);
}
