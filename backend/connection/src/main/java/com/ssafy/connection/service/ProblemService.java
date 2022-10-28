package com.ssafy.connection.service;

import com.ssafy.connection.dto.ProblemReturnDto;

import java.util.List;

public interface ProblemService {

    List<ProblemReturnDto> getProblemList();

    void loadAllProblemFromApi();

    List<ProblemReturnDto> getSolvedProblemList(String baekjoonId);

    Object getPopularProblemList(long level, String tag);

    Object getWorkBookProblemList();

    Object getPopularProblemList(String tag);

    Object getPopularProblemList(Long level);

    Object getPopularProblemList();

    List<ProblemReturnDto> getProblem(String title);

    List<ProblemReturnDto> getProblem(long problemId);

    List<ProblemReturnDto> getProblemByTag(String ko);

    List<ProblemReturnDto> searchProblem(String keyword);
}
