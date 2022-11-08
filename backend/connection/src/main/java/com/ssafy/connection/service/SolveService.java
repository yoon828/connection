package com.ssafy.connection.service;

import java.util.List;

public interface SolveService {
    boolean isSolved(long problemId, long userId);

    boolean saveSolve(String problemId, String baekjoonId);

    boolean saveSolve2(String baekjoonId, Long problemId);

    boolean saveSolveList(List<Integer> list, Long userId);
}
