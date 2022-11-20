package com.ssafy.connection.service;

import com.ssafy.connection.dto.GitPushDto;
import com.ssafy.connection.entity.*;
import com.ssafy.connection.repository.*;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import com.ssafy.connection.securityOauth.repository.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
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
        Solve solveEntity = new Solve();
        Long problemId = Long.valueOf(gitPushDto.getProblemNo().replace("\u00a0", "").trim());
        User userEntity = userRepository.findByBackjoonId(gitPushDto.getUserId());
        Optional<Problem> problemEntity = problemRepository.findById(problemId);
        if(problemEntity.isPresent()){
            solveEntity.setProblem(problemEntity.get());
        } else {
            return false;
        }

        solveEntity.setUser(userEntity);
        solveEntity.setTime(LocalDateTime.now());

        ConnStudy connStudy = connStudyRepository.findByUser(userEntity);
        Study study = studyRepository.findByConnStudy(connStudy);
        List<Subject> curSubjectList = subjectRepository.findAllByStudyDesc(study.getStudyId());

        // 스터디에서 진행된 과제가 하나도 없는 경우(예외처리), status를 2(일반)로 해서 저장
        if(curSubjectList.size() == 0){
            Optional<Solve> solveEntityPrev = solveRepository.findNormalByUserAndProblem(userEntity.getUserId(), problemId);
            // 이전에 개인적으로 푼 풀이가 등록되어 있는 경우 Update
            if(solveEntityPrev.isPresent()){
                Solve temp = solveEntityPrev.get();
                temp.setTime(LocalDateTime.now());
                temp.setStatus(2);
                solveRepository.save(temp);
            } else {    // 처음 푼 문제라면 Save
                solveEntity.setStatus(2);
                solveRepository.save(solveEntity);
            }
            return true;
        }

        // 가장 최근에 진행된 또는 현재 진행중인 과제의 제출 기한
        LocalDateTime curDeadLine = curSubjectList.get(0).getDeadline();

        for(Subject subject : curSubjectList){
            if(!subject.getDeadline().isEqual(curDeadLine)){
                solveEntity.setStatus(2);
                break;
            }

            // 입력받은 problemId가 과제에 등록되어 있고, 현재 시간이 과제 시작시잔과 제출기한 사이에 있다면 과제(0)로 등록
            if(subject.getProblem().getProblemId() == problemId && subject.getDeadline().isAfter(LocalDateTime.now()) && subject.getStart().isBefore(LocalDateTime.now())){
                Optional<Solve> solveEntityPrev = solveRepository.findSubjectByUserAndProblem(userEntity.getUserId(), problemId);
                // 이전에 과제로 푼 풀이가 등록되어 있는 경우 Update
                if(solveEntityPrev.isPresent()){
                    Solve temp = solveEntityPrev.get();
                    // 이전 풀이가 현재 진행중인 과제로 등록되어 있지 않은 경우, Score up & Update & Github Push
                    if(!temp.getTime().isAfter(subject.getStart())){
                        this.addSubjectScore(userEntity, problemEntity.get());
                        temp.setTime(LocalDateTime.now());
                        solveRepository.save(temp);
                        this.pushSubject(gitPushDto);
                        break;
                    } else if(temp.getStatus() != 2) {    // 이전 풀이가 현재 진행중인 과제로 등록되어 있는 경우(추가로 제출한 경우), Update & Github Push
                        temp.setTime(LocalDateTime.now());
                        solveRepository.save(temp);
                        this.pushSubject(gitPushDto);
                        break;
                    } else {
                        this.addSubjectScore(userEntity, problemEntity.get());
                        temp.setTime(LocalDateTime.now());
                        solveRepository.save(temp);
                        this.pushSubject(gitPushDto);
                        break;
                    }
                } else {    // 이전에 과제로 푼 풀이가 등록되어 있지 않은 경우 Score up & Save & Github Push
                    solveEntity.setStatus(0);
                    System.out.println("aa");
                    this.addSubjectScore(userEntity, problemEntity.get());
                    solveRepository.save(solveEntity);
                    this.pushSubject(gitPushDto);
                    break;
                }
            } else {    // 입력받은 problemId가 과제에 등록되어 있지 않은 경우 일반(2)으로 등록
                Optional<Solve> solveEntityPrev = solveRepository.findNormalByUserAndProblem(userEntity.getUserId(), problemId);
                // 이전에 개인적으로 푼 풀이가 등록되어 있는 경우 Update
                if(solveEntityPrev.isPresent()){
                    Solve temp = solveEntityPrev.get();
                    temp.setTime(LocalDateTime.now());
                    temp.setStatus(2);
                    solveRepository.save(temp);
                } else {    // 플이가 등록되어있지 않은 경우 Save
                    solveEntity.setStatus(2);
                    solveRepository.save(solveEntity);
                }
            }
        }
        return true;
    }

    @Transactional
    public boolean checkBonus(User userEntity) {
        List<Solve> todaySolveList = solveRepository.findAllByUserToday(userEntity.getUserId());
        return todaySolveList.size() == 0;
    }

    public void addSubjectScore(User userEntity, Problem problemEntity){
        ConnStudy connStudyEntity = connStudyRepository.findByUser(userEntity);
        connStudyEntity.setSubjectScore((int) (connStudyEntity.getSubjectScore() + problemEntity.getLevel()));
        if(this.checkBonus(userEntity)){
            connStudyEntity.setBonusScore(connStudyEntity.getBonusScore() + 30);
        }
        connStudyRepository.save(connStudyEntity);
    }

    public void addStudyScore(User userEntity, Problem problemEntity){
        ConnStudy connStudyEntity = connStudyRepository.findByUser(userEntity);
        connStudyEntity.setStudyScore((int) ((connStudyEntity.getStudyScore()) + problemEntity.getLevel()));
        if(this.checkBonus(userEntity)){
            connStudyEntity.setBonusScore((connStudyEntity.getBonusScore() + 30));
        }
        connStudyRepository.save(connStudyEntity);
    }

    public void pushSubject(GitPushDto gitPushDto){
        try {
            gitPushDto.setProblemNo(gitPushDto.getProblemNo().replace("\u00a0", "").trim());
            subjectService.submitSubject(gitPushDto);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void pushStudy(GitPushDto gitPushDto){
        try {
            gitPushDto.setProblemNo(gitPushDto.getProblemNo().replace("\u00a0", "").trim());
            subjectService.submitStudy(gitPushDto);
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
        Optional<Solve> normalSolveEntity = solveRepository.findNormalByUserAndProblem(userEntity.getUserId(), problemId);
        List<Subject> subjectList = subjectRepository.findAllByStudyAndProblemOrderByDeadLine(studyEntity.getStudyId(), problemId);
        Solve solveEntity = new Solve();
        solveEntity.setUser(userEntity);
        solveEntity.setProblem(problemEntity.get());
        solveEntity.setTime(LocalDateTime.now());
        solveEntity.setStatus(1);

        if(studySolveEntity.isPresent()){   // 이미 스터디에서 같이 푼 문제일 경우 Update
            Solve temp = studySolveEntity.get();
            temp.setTime(LocalDateTime.now());
            solveRepository.save(temp);
            return true;
        } else if(normalSolveEntity.isPresent()){  // 일반으로 푼 문제가 등록되어 있을 경우 스터디에서 같이 푼 문제로 바꿔서 Update & Score Up
            this.addStudyScore(userEntity, problemEntity.get());
            Solve temp = normalSolveEntity.get();
            temp.setStatus(1);
            temp.setTime(LocalDateTime.now());
            solveRepository.save(temp);
            this.pushStudy(gitPushDto);
            return true;
        } else if(subjectList.size() > 0){
            Subject recentSubjectEntity = subjectList.get(0);
            LocalDateTime recentDeadLine = recentSubjectEntity.getDeadline();
            if(recentDeadLine.isAfter(LocalDateTime.now())){
                this.addStudyScore(userEntity, problemEntity.get());
                solveRepository.save(solveEntity);
                this.pushStudy(gitPushDto);
                return true;
            }
        } else {
            this.addStudyScore(userEntity, problemEntity.get());
            solveRepository.save(solveEntity);
            this.pushStudy(gitPushDto);
            return true;
        }
        return false;
    }

    @Override
    public boolean saveSolveList(List<Integer> list, Long userId, String baekjoonId) {
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

        User userEntity = userRepository.findById(userId).get();
        userEntity.setBackjoonId(baekjoonId);
        userRepository.save(userEntity);

        return true;
    }
}
