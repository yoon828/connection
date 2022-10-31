package com.ssafy.connection.service;

public interface SolveService {
    boolean isSolved(long problemId, long userId);

    boolean saveSolve(Long problemId, Long userId);
}
