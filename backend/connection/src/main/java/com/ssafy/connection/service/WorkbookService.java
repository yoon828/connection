package com.ssafy.connection.service;

public interface WorkbookService {

    void addProblem(Long problemId, Long userId);

    void deleteProblem(Long problemId, Long userId);
}
