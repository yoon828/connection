package com.ssafy.connection.service;

import com.ssafy.connection.dto.GitPushDto;
import com.ssafy.connection.entity.*;
import com.ssafy.connection.repository.*;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import com.ssafy.connection.securityOauth.repository.user.UserRepository;
import io.netty.handler.codec.protobuf.ProtobufVarint32LengthFieldPrepender;
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
    private final SubjectService subjectService;

    public SolveServiceImpl(UserRepository userRepository, ProblemRepository problemRepository, SolveRepository solveRepository,
                            ConnStudyRepository connStudyRepository, StudyRepository studyRepository, SubjectRepository subjectRepository,
                            SubjectService subjectService){
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.solveRepository = solveRepository;
        this.connStudyRepository = connStudyRepository;
        this.studyRepository = studyRepository;
        this.subjectRepository = subjectRepository;
        this.subjectService = subjectService;
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
    public boolean saveSolve(GitPushDto gitPushDto) {
        Long problemId = Long.valueOf(gitPushDto.getProblemNo().replace("\u00a0", "").trim());
        Solve solveEntity = new Solve();
        User user = userRepository.findByBackjoonId(gitPushDto.getUserId());
        solveEntity.setUser(user);
        Optional<Problem> problemEntity = problemRepository.findById(problemId);
        if(problemEntity.isPresent()){
            solveEntity.setProblem(problemEntity.get());
        } else {
            return false;
        }
        solveEntity.setTime(LocalDateTime.now());

        ConnStudy connStudy = connStudyRepository.findByUser(user);
        Study study = studyRepository.findByConnStudy(connStudy);
        List<Subject> curSubjectList = subjectRepository.findAllByStudyDesc(study.getStudyId());

        if(curSubjectList.size() == 0){
            Optional<Solve> solveEntityPrev = solveRepository.findNormalByUserAndProblem(user.getUserId(), problemId);
            if(solveEntityPrev.isPresent()){
                Solve temp = solveEntityPrev.get();
                temp.setTime(LocalDateTime.now());
                temp.setStatus(2);
                solveRepository.save(temp);
            } else {
                solveEntity.setStatus(2);
                solveRepository.save(solveEntity);
            }
            return true;
        }

        LocalDateTime curDeadLine = curSubjectList.get(0).getDeadline();

        for(Subject subject : curSubjectList){
            if(!subject.getDeadline().isEqual(curDeadLine)){
                solveEntity.setStatus(2);
                break;
            }

            if(subject.getProblem().getProblemId() == Long.parseLong(gitPushDto.getProblemNo().trim()) && subject.getDeadline().isAfter(LocalDateTime.now()) && subject.getStart().isBefore(LocalDateTime.now())){

                Optional<Solve> solveEntityPrev = solveRepository.findSubjectByUserAndProblem(user.getUserId(), problemId);
                if(solveEntityPrev.isPresent()){
                    Solve temp = solveEntityPrev.get();

                    if(!temp.getTime().isAfter(subject.getStart())){
                        temp.setTime(LocalDateTime.now());
                        solveRepository.save(temp);
                        study.setHomeworkScore((int) (study.getHomeworkScore() + problemEntity.get().getLevel()));
                        studyRepository.save(study);
                        this.pushGithub(gitPushDto);
                        break;
                    } else {
                        temp.setTime(LocalDateTime.now());
                        solveRepository.save(temp);
                        this.pushGithub(gitPushDto);
                        break;
                    }
                } else {
                    solveEntity.setStatus(0);
                    study.setHomeworkScore((int) (study.getHomeworkScore() + problemEntity.get().getLevel()));
                    solveRepository.save(solveEntity);
                    studyRepository.save(study);
                    this.pushGithub(gitPushDto);
                    break;
                }
            } else {
                Optional<Solve> solveEntityPrev = solveRepository.findNormalByUserAndProblem(user.getUserId(), problemId);
                if(solveEntityPrev.isPresent()){
                    Solve temp = solveEntityPrev.get();
                    temp.setTime(LocalDateTime.now());
                    temp.setStatus(2);
                    solveRepository.save(temp);
                } else {
                    solveEntity.setStatus(2);
                    solveRepository.save(solveEntity);
                }
            }
        }

        return true;
    }

    public void pushGithub(GitPushDto gitPushDto){
        try {
            subjectService.submitSubject(gitPushDto);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean saveSolve2(GitPushDto gitPushDto) {
        Long problemId = Long.valueOf(gitPushDto.getProblemNo().replace("\u00a0", "").trim());
        User userEntity = userRepository.findByBackjoonId(gitPushDto.getUserId());
        ConnStudy connStudyEntity = connStudyRepository.findByUser(userEntity);
        Study studyEntity = studyRepository.findByConnStudy(connStudyEntity);
        Optional<Problem> problemEntity = problemRepository.findById(problemId);

        if(!problemEntity.isPresent()){
            return false;
        }

        Optional<Solve> studySolveEntity = solveRepository.findStudyByUserAndProblem(userEntity.getUserId(), problemId);
        // 이미 스터디에서 같이 푼 문제일 경우 Update
        if(studySolveEntity.isPresent()){
            Solve temp = studySolveEntity.get();
            temp.setTime(LocalDateTime.now());
            solveRepository.save(temp);
            studyEntity.setHomeworkScore((int) (studyEntity.getHomeworkScore() + problemEntity.get().getLevel()));
            return true;
        }

        Solve solveEntity = new Solve();
        solveEntity.setUser(userEntity);
        solveEntity.setProblem(problemEntity.get());

        Optional<Solve> normalSolveEntity = solveRepository.findNormalByUserAndProblem(userEntity.getUserId(), problemId);
        // 일반으로 푼 문제가 등록되어 있을 경우 스터디에서 같이 푼 문제로 바꿔서 Update
        if(normalSolveEntity.isPresent()){
            Solve temp = normalSolveEntity.get();
            temp.setStatus(1);
            temp.setTime(LocalDateTime.now());
            solveRepository.save(temp);
            studyEntity.setHomeworkScore((int) (studyEntity.getHomeworkScore() + problemEntity.get().getLevel()));
            this.pushGithub(gitPushDto);
        } else {    // 일반으로 푼 문제가 등록되어 있지 않을 경우 Save
            solveEntity.setTime(LocalDateTime.now());
            solveEntity.setStatus(1);
            solveRepository.save(solveEntity);
            studyEntity.setHomeworkScore((int) (studyEntity.getHomeworkScore() + problemEntity.get().getLevel()));
            this.pushGithub(gitPushDto);
        }
        return true;
    }

    @Override
    public boolean saveSolveList(List<Integer> list, Long userId) {
        for(Integer problemId : list){
            Optional<Solve> prevSolveEntity = solveRepository.findNormalByUserAndProblem(userId, Long.valueOf(problemId));
            if(prevSolveEntity.isPresent()){
                continue;
            } else {
                Solve solveEntity = new Solve();
                solveEntity.setUser(userRepository.findById(userId).get());
                Optional<Problem> problemEntity = problemRepository.findById(Long.valueOf(problemId));
                if(problemEntity.isPresent()){
                    solveEntity.setProblem(problemEntity.get());
                } else {
                    return false;
                }
                solveEntity.setStatus(2);
                solveEntity.setTime(LocalDateTime.now());
                solveRepository.save(solveEntity);
            }
        }
        return true;
    }
}
