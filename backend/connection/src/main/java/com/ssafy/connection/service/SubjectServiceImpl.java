package com.ssafy.connection.service;

import com.ssafy.connection.dto.SubjectDto;
import com.ssafy.connection.entity.ConnStudy;
import com.ssafy.connection.entity.Study;
import com.ssafy.connection.entity.Subject;
import com.ssafy.connection.repository.ConnStudyRepository;
import com.ssafy.connection.repository.ProblemRepository;
import com.ssafy.connection.repository.StudyRepository;
import com.ssafy.connection.repository.SubjectRepository;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import com.ssafy.connection.securityOauth.repository.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SubjectServiceImpl implements SubjectService{

    private final SubjectRepository subjectRepository;
    private final StudyRepository studyRepository;
    private final ProblemRepository problemRepository;
    private final ConnStudyRepository  connStudyRepository;
    private final UserRepository userRepository;

    public SubjectServiceImpl(SubjectRepository subjectRepository, StudyRepository studyRepository, ProblemRepository problemRepository,
                              ConnStudyRepository connStudyRepository, UserRepository userRepository){
        this.subjectRepository = subjectRepository;
        this.studyRepository = studyRepository;
        this.problemRepository = problemRepository;
        this.connStudyRepository = connStudyRepository;
        this.userRepository = userRepository;
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
    public void getTeamStatus(Long userId){
        Study studyEntity = studyRepository.findByConnStudy(
                                connStudyRepository.findByUser(
                                    userRepository.findById(userId).get()));
        List<Subject> subjectList = subjectRepository.findAllByStudy(studyEntity);
        System.out.println(subjectList.toString());
    }
}
