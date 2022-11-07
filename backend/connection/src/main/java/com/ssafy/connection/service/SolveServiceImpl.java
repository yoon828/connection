package com.ssafy.connection.service;

import com.ssafy.connection.entity.*;
import com.ssafy.connection.repository.*;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import com.ssafy.connection.securityOauth.repository.user.UserRepository;
import org.apache.tomcat.jni.Local;
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
    private final ConnStudyRepository connStudyRepository;
    private final StudyRepository studyRepository;
    private final SubjectRepository subjectRepository;

    public SolveServiceImpl(UserRepository userRepository, ProblemRepository problemRepository, SolveRepository solveRepository,
                            ConnStudyRepository connStudyRepository, StudyRepository studyRepository, SubjectRepository subjectRepository){
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.solveRepository = solveRepository;
        this.connStudyRepository = connStudyRepository;
        this.studyRepository = studyRepository;
        this.subjectRepository = subjectRepository;
    }

    @Override
    @Transactional
    public boolean isSolved(long problemId, long userId) {
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
        User user = userRepository.findByBackjoonId(baekjoonId);
        solveEntity.setUser(user);
        Optional<Problem> problemEntity = problemRepository.findById(Long.parseLong(problemId));
        if(problemEntity.isPresent()){
            solveEntity.setProblem(problemEntity.get());
        } else {
            return false;
        }
        solveEntity.setTime(LocalDateTime.now());

        ConnStudy connStudy = connStudyRepository.findByUser(user);
        Study study = studyRepository.findByConnStudy(connStudy);
        System.out.println(study.getStudyId());
        List<Subject> curSubjectList = subjectRepository.findAllByStudyDesc(study.getStudyId());
        LocalDateTime curDeadLine = curSubjectList.get(0).getDeadline();

        for(Subject subject : curSubjectList){
            if(!subject.getDeadline().isEqual(curDeadLine)){
                solveEntity.setStatus(2);
                break;
            }

            if(subject.getProblem().getProblemId() == Long.parseLong(problemId) && subject.getDeadline().isAfter(LocalDateTime.now()) && subject.getStart().isBefore(LocalDateTime.now())){
                solveEntity.setStatus(0);
                study.setHomeworkScore((int) (study.getHomeworkScore() + problemEntity.get().getLevel()));
                studyRepository.save(study);
                break;
            } else {
                solveEntity.setStatus(2);
                solveRepository.save(solveEntity);
            }
        }

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
