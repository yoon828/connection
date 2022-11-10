package com.ssafy.connection.service;

import com.ssafy.connection.dto.ProblemDto;
import com.ssafy.connection.dto.ProblemReturnDto;
import com.ssafy.connection.entity.*;
import com.ssafy.connection.repository.*;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import com.ssafy.connection.securityOauth.repository.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class WorkbookServiceImpl implements WorkbookService{
    private final WorkbookRepository workbookRepository;
    private final StudyRepository studyRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final ConnStudyRepository connStudyRepository;
    private final ConnWorkbookRepository connWorkbookRepository;
    private final TagRepository tagRepository;

    public WorkbookServiceImpl(WorkbookRepository workbookRepository, StudyRepository studyRepository, ProblemRepository problemRepository, UserRepository userRepository,
                                    ConnStudyRepository connStudyRepository, ConnWorkbookRepository connWorkbookRepository, TagRepository tagRepository){
        this.workbookRepository = workbookRepository;
        this.studyRepository = studyRepository;
        this.problemRepository = problemRepository;
        this.userRepository = userRepository;
        this.connStudyRepository = connStudyRepository;
        this.connWorkbookRepository = connWorkbookRepository;
        this.tagRepository = tagRepository;
    }

    @Override
    @Transactional
    public int addProblem(Long problemId, Long userId) {
        Optional<Problem> problemEntity = problemRepository.findById(problemId);
        if(problemEntity.isPresent()){
            Optional<Workbook> workbookEnity = workbookRepository.findByStudy(
                                                studyRepository.findByConnStudy(
                                                    connStudyRepository.findByUser(
                                                        userRepository.getById(userId))));
            if(workbookEnity.isPresent()){
                List<ConnWorkbook> connWorkbookList = connWorkbookRepository.findAllByWorkbookAndProblem(workbookEnity.get(), problemEntity.get());
                if(connWorkbookList.size() == 0){
                    connWorkbookRepository.save(new ConnWorkbook(problemEntity.get(), workbookEnity.get()));
                } else {
                    return 0;
                }
                return 1;
            } else {
                return -1;
            }
        } else {
            return 2;
        }
    }

    @Override
    @Transactional
    public int deleteProblem(Long problemId, Long userId) {
        Optional<Problem> problemEntity = problemRepository.findById(problemId);
        if(problemEntity.isPresent()){
            Optional<Workbook> workbookEnity = workbookRepository.findByStudy(
                                        studyRepository.findByConnStudy(
                                            connStudyRepository.findByUser(
                                                userRepository.getById(userId))));
            if(workbookEnity.isPresent()){
                return connWorkbookRepository.deleteByWorkbookAndProblem(workbookEnity.get(), problemEntity.get());
            } else {
                return -1;
            }
        } else {
            return -2;
        }
    }

    @Override
    @Transactional
    public List<ProblemReturnDto> getProblem(Long userId) {
        List<ProblemReturnDto> returnList = new ArrayList<>();
        User userEntity = userRepository.getById(userId);
        ConnStudy connStudyEntity = connStudyRepository.findByUser(userEntity);
        Optional<Study> studyEntity = Optional.ofNullable(studyRepository.findByConnStudy(connStudyEntity));
        if(studyEntity.isEmpty()){
            return returnList;
        }

        List<ConnWorkbook> connWorkbookList = connWorkbookRepository.findAllByWorkbook(workbookRepository.findByStudy(studyEntity.get()).get());
        for(ConnWorkbook connWorkbook : connWorkbookList){
            Problem problemEntity = connWorkbook.getProblem();
            returnList.add(new ProblemReturnDto(ProblemDto.of(problemEntity), tagRepository.findAllByProblem(problemEntity)));
        }
        return returnList;
    }
}
