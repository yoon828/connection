package com.ssafy.connection.service;

import com.ssafy.connection.dto.ProblemReturnDto;
import com.ssafy.connection.dto.UserStatDto;
import com.ssafy.connection.securityOauth.config.security.token.UserPrincipal;

import java.util.List;
import java.util.Map;

public interface ProblemService {

    List<ProblemReturnDto> getProblemList();

    void loadAllProblemFromApi();


    List<ProblemReturnDto> getPopularProblemList(long level, String tag);

    List<ProblemReturnDto> getWorkBookProblemList();

    List<ProblemReturnDto> getPopularProblemList(String tag);

    List<ProblemReturnDto> getPopularProblemList(Long level);

    List<ProblemReturnDto> getPopularProblemList();

    List<ProblemReturnDto> getProblem(String title);

    List<ProblemReturnDto> getProblem(long problemId);

    List<ProblemReturnDto> getProblemByTag(String ko);

    List<ProblemReturnDto> searchProblem(String keyword, UserPrincipal userPrincipal);

    List<ProblemReturnDto> getWeakProblemList(List<Map.Entry<String, Integer>> entryList);

    List<Map.Entry<String, Integer>> getUserStat(Long id);

    List<UserStatDto> getUserStatList(List<Map.Entry<String, Integer>> userStat);
}
