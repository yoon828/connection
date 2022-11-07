package com.ssafy.connection.service;

import com.ssafy.connection.dto.ProblemDto;
import com.ssafy.connection.entity.Problem;
import com.ssafy.connection.entity.Review;
import com.ssafy.connection.repository.ProblemRepository;
import com.ssafy.connection.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ReviewServiceImpl implements ReviewService{
    private final ReviewRepository reviewRepository;
    private final ProblemRepository problemRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository, ProblemRepository problemRepository){
        this.reviewRepository = reviewRepository;
        this.problemRepository = problemRepository;
    }


    @Override
    public int saveReview(List<Map<String, Object>> map) {
        List<Review> saveList = new ArrayList<>();
        for(Map<String, Object> reviewInput : map){
            Review reviewEntity = new Review();
            long problemId = Long.parseLong((String) reviewInput.get("problemId"));
            int difficulty = Integer.parseInt((String) reviewInput.get("difficulty"));

            Optional<Problem> problemEntity = problemRepository.findById(problemId);
            if(problemEntity.isPresent()){
                reviewEntity.setDifficulty(difficulty);
                reviewEntity.setProblem(problemEntity.get());
                saveList.add(reviewEntity);
            } else {
                return -1;
            }
        }
        reviewRepository.saveAll(saveList);
        return 1;
    }

    @Override
    public int getAvgDifficulty(ProblemDto problemDto) {
        long count = reviewRepository.findCountBtProblem(problemDto.getProblemId());
        if(count == 0){
            return 0;
        }
        long sum = reviewRepository.findSumByProblem(problemDto.getProblemId());

        return Math.round(sum / count);
    }
}