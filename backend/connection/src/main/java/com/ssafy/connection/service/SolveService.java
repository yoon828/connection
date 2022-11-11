package com.ssafy.connection.service;

import com.ssafy.connection.dto.GitPushDto;

import java.util.List;

public interface SolveService {
    boolean isSolved(long problemId, long userId);

    boolean saveSolve(GitPushDto gitPushDto);

    boolean saveSolve2(GitPushDto gitPushDto);

    boolean saveSolveList(List<Integer> list, Long userId, String baekjoonId);
}
