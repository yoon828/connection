package com.ssafy.connection.service;

import com.ssafy.connection.dto.SubjectDto;
import com.ssafy.connection.entity.Subject;
import com.ssafy.connection.repository.ProblemRepository;
import com.ssafy.connection.repository.StudyRepository;
import com.ssafy.connection.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SubjectServiceImpl implements SubjectService{

    private final SubjectRepository subjectRepository;
    private final StudyRepository studyRepository;
    private final ProblemRepository problemRepository;

    public SubjectServiceImpl(SubjectRepository subjectRepository, StudyRepository studyRepository, ProblemRepository problemRepository){
        this.subjectRepository = subjectRepository;
        this.studyRepository = studyRepository;
        this.problemRepository = problemRepository;
    }

//    @Override
//    public void save(Subject subject) {
//        subjectRepository.save(subject);
//    }
    @Override
    public int makeSubject(SubjectDto subjectDto, Long userId){
        studyRepository.getById(subjectDto.getStudyId());

        List<Subject> list = new ArrayList<>();
        List<Long> problemList = subjectDto.getProblemList();
        for(int i = 0; i<problemList.size(); i++){
            Subject subject = new Subject();
            subject.setDeadline(subjectDto.getDeadline());
            subject.setStudy(studyRepository.getById(subjectDto.getStudyId()));
            subject.setProblem(problemRepository.getById(problemList.get(i)));
            list.add(subject);
        }
        subjectRepository.saveAll(list);

        return problemList.size();
    }

    @Override
    public void getTeamStatus(Long studyId, Long userId){

    }
}
