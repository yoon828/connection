package com.ssafy.connection.service;

import com.ssafy.connection.entity.Problem;
import com.ssafy.connection.entity.Solve;
import com.ssafy.connection.repository.ProblemRepository;
import com.ssafy.connection.repository.SolveRepository;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import com.ssafy.connection.securityOauth.repository.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.List;
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
            StringBuffer result = new StringBuffer();
            User user = userRepository.getById(userId);
        URL url = null;
        try {
            url = new URL("https://solved.ac/api/v3/search/problem?query=solved_by%3" + user.getBackjoonId());
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
        HttpURLConnection urlConnection = null;
        try {
            urlConnection = (HttpURLConnection) url.openConnection();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        try {
            urlConnection.setRequestMethod("GET");
        } catch (ProtocolException e) {
            throw new RuntimeException(e);
        }
        urlConnection.setRequestProperty("Content-type", "application/json");


        Optional<Solve> solve = solveRepository.findByUserAndProblem(userRepository.getById(userId), problemRepository.getById(problemId));
        if(solve.isPresent()){
            return true;
        } else {
            return false;
        }
    }

    @Override
    public boolean saveSolve(String problemId, String baekjoonId) {
        Solve solveEntity = new Solve();
        solveEntity.setUser(userRepository.findByBackjoonId(baekjoonId));
        Optional<Problem> problemEntity = problemRepository.findById(Long.parseLong(problemId));
        if(problemEntity.isPresent()){
            solveEntity.setProblem(problemEntity.get());
        } else {
            return false;
        }
        solveEntity.setStatus(0);
        solveEntity.setTime(LocalDateTime.now());
        solveRepository.save(solveEntity);
        return true;
    }

    @Override
    public boolean saveSolveList(List<String> list, Long userId) {
        for(String problemString : list){
            Solve solveEntity = new Solve();
            solveEntity.setUser(userRepository.findById(userId).get());
            Optional<Problem> problemEntity = problemRepository.findById(Long.parseLong(problemString));
            if(problemEntity.isPresent()){
                solveEntity.setProblem(problemEntity.get());
            } else {
                return false;
            }
            solveEntity.setStatus(0);
            solveEntity.setTime(LocalDateTime.now());
            solveRepository.save(solveEntity);
        }
        return true;
    }
}
