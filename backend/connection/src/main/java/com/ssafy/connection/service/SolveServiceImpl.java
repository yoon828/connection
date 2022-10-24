package com.ssafy.connection.service;

import com.ssafy.connection.entity.Solve;
import com.ssafy.connection.repository.ProblemRepository;
import com.ssafy.connection.repository.SolveRepository;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import com.ssafy.connection.securityOauth.repository.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Optional;

@Service
public class SolveServiceImpl implements SolveService{
    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final SolveRepository solveRepository;

    public SolveServiceImpl(UserRepository userRepository, ProblemRepository problemRepository, SolveRepository solveRepository){
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.solveRepository = solveRepository;
    }


    @Override
    @Transactional
    public boolean isSolved(long problemId, long userId) {
        try{
            StringBuffer result = new StringBuffer();
            User user = userRepository.getById(userId);
            URL url = new URL("https://solved.ac/api/v3/search/problem?query=solved_by%3" + user.getBackjoonId());
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            urlConnection.setRequestMethod("GET");
            urlConnection.setRequestProperty("Content-type", "application/json");
        } catch (Exception e){
            throw new Exception(e);
        }

        Optional<Solve> solve = solveRepository.findByUserAndProblem(userRepository.getById(userId), problemRepository.getById(problemId));
        if(solve.isPresent()){
            return true;
        } else {
            return false;
        }
    }
}
