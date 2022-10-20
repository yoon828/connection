package com.ssafy.connection.service;

import com.ssafy.connection.entity.Solve;
import com.ssafy.connection.repository.ProblemRepository;
import com.ssafy.connection.repository.SolveRepository;
import com.ssafy.connection.securityOauth.repository.user.UserRepository;
import org.springframework.stereotype.Service;

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
    public boolean isSolved(long problemId, long userId) {
        Optional<Solve> solve = solveRepository.findByUserAndProblem(userRepository.getById(userId), problemRepository.getById(problemId));
        if(solve.isPresent()){
            return true;
        } else {
            return false;
        }
    }
}
