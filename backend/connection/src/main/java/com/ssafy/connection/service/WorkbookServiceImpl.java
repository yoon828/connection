package com.ssafy.connection.service;

import com.ssafy.connection.entity.ConnWorkbook;
import com.ssafy.connection.entity.Problem;
import com.ssafy.connection.entity.Workbook;
import com.ssafy.connection.repository.*;
import com.ssafy.connection.securityOauth.repository.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WorkbookServiceImpl implements WorkbookService{
    private final WorkbookRepository workbookRepository;
    private final StudyRepository studyRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final ConnStudyRepository connStudyRepository;
    private final ConnWorkbookRepository connWorkbookRepository;

    public WorkbookServiceImpl(WorkbookRepository workbookRepository, StudyRepository studyRepository,
                               ProblemRepository problemRepository, UserRepository userRepository,
                               ConnStudyRepository connStudyRepository, ConnWorkbookRepository connWorkbookRepository){
        this.workbookRepository = workbookRepository;
        this.studyRepository = studyRepository;
        this.problemRepository = problemRepository;
        this.userRepository = userRepository;
        this.connStudyRepository = connStudyRepository;
        this.connWorkbookRepository = connWorkbookRepository;
    }

    @Override
    @Transactional
    public void addProblem(Long problemId, Long userId) {
        Problem problemEntity = problemRepository.getById(problemId);
        Workbook workbookEnity = workbookRepository.findByStudy(
                                    studyRepository.findByConnStudy(
                                         connStudyRepository.findByUser(
                                            userRepository.getById(userId))));
        connWorkbookRepository.save(new ConnWorkbook(problemEntity, workbookEnity));
    }

    @Override
    @Transactional
    public void deleteProblem(Long problemId, Long userId) {
        Problem problemEntity = problemRepository.getById(problemId);
        Workbook workbookEnity = workbookRepository.findByStudy(
                                    studyRepository.findByConnStudy(
                                            connStudyRepository.findByUser(
                                                    userRepository.getById(userId))));
        connWorkbookRepository.deleteByWorkbookAndProblem(workbookEnity, problemEntity);
    }
}
