package com.ssafy.connection.service;

import com.nimbusds.openid.connect.sdk.UserInfoResponse;
import com.ssafy.connection.dto.ProblemDto;
import com.ssafy.connection.entity.Problem;
import com.ssafy.connection.entity.Review;
import com.ssafy.connection.repository.ProblemRepository;
import com.ssafy.connection.repository.ReviewRepository;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import com.ssafy.connection.securityOauth.repository.user.UserRepository;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ReviewServiceImpl implements ReviewService{
    private final ReviewRepository reviewRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository, ProblemRepository problemRepository, UserRepository userRepository){
        this.reviewRepository = reviewRepository;
        this.problemRepository = problemRepository;
        this.userRepository = userRepository;
    }


    @Override
    public int saveReview(String beakjoonId, List<Map<String, Object>> map) {
        User userEntity = userRepository.findByBackjoonId(beakjoonId);
        List<Review> saveList = new ArrayList<>();

        for(Map<String, Object> reviewInput : map){
            long problemId = Long.parseLong((String) reviewInput.get("problemId"));
            Optional<Problem> problemEntity = problemRepository.findById(problemId);
            if(problemEntity.isPresent()){
                Optional<Review> reviewCheck = reviewRepository.findByUserAndProblem(userEntity, problemEntity.get());
                if(!reviewCheck.isPresent()){
                    Review reviewEntity = new Review();
                    int difficulty = Integer.parseInt((String) reviewInput.get("difficulty"));
                    reviewEntity.setDifficulty(difficulty);
                    reviewEntity.setProblem(problemEntity.get());
                    reviewEntity.setUser(userEntity);
                    saveList.add(reviewEntity);
                } else {
                    return 0;
                }
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
