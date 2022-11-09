package com.ssafy.connection.service;

import com.ssafy.connection.dto.ProblemDto;

import java.util.List;
import java.util.Map;

public interface ReviewService {
    int saveReview(String beakjoonId, List<Map<String, Object>> map);

    int getAvgDifficulty(ProblemDto problemDto);
}
