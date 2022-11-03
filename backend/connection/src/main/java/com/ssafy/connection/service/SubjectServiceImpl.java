package com.ssafy.connection.service;

import com.ssafy.connection.dto.ResponseDto;
import com.ssafy.connection.dto.SubjectDto;
import com.ssafy.connection.entity.ConnStudy;
import com.ssafy.connection.entity.Solve;
import com.ssafy.connection.entity.Study;
import com.ssafy.connection.entity.Subject;
import com.ssafy.connection.repository.*;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import com.ssafy.connection.securityOauth.repository.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class SubjectServiceImpl implements SubjectService{

    private final SubjectRepository subjectRepository;
    private final StudyRepository studyRepository;
    private final ProblemRepository problemRepository;
    private final ConnStudyRepository  connStudyRepository;
    private final UserRepository userRepository;
    private final SolveRepository solveRepository;

    public SubjectServiceImpl(SubjectRepository subjectRepository, StudyRepository studyRepository, ProblemRepository problemRepository,
                              ConnStudyRepository connStudyRepository, UserRepository userRepository, SolveRepository solveRepository){
        this.subjectRepository = subjectRepository;
        this.studyRepository = studyRepository;
        this.problemRepository = problemRepository;
        this.connStudyRepository = connStudyRepository;
        this.userRepository = userRepository;
        this.solveRepository = solveRepository;
    }

//    @Override
//    public void save(Subject subject) {
//        subjectRepository.save(subject);
//    }
    @Override
    public ResponseEntity makeSubject(SubjectDto subjectDto, Long userId){
        Optional<ConnStudy> connStudy = connStudyRepository.findByUser_UserId(userId);
        if(!connStudy.isPresent()) return new ResponseEntity<>(new ResponseDto("empty"), HttpStatus.CONFLICT);
        Study study = studyRepository.findByConnStudy(connStudy.get());

        List<Subject> list = new ArrayList<>();
        List<Long> problemList = subjectDto.getProblemList();

        for(int i = 0; i<problemList.size(); i++){
            Subject subject = new Subject();
            subject.setStart(subjectDto.getStart());
            subject.setDeadline(subjectDto.getDeadline());
            subject.setStudy(study);
            try {
                subject.setProblem(problemRepository.getById(problemList.get(i)));
            }
            catch (Exception e){
                return new ResponseEntity<>(new ResponseDto("wrong parameter value"), HttpStatus.CONFLICT);
            }
            list.add(subject);
        }
        try {
            subjectRepository.saveAll(list);
        }
        catch (Exception e){
            return new ResponseEntity<>(new ResponseDto("wrong parameter value"), HttpStatus.CONFLICT);
        }

        return new ResponseEntity<>(new ResponseDto("success"), HttpStatus.OK);
    }

    @Override
    @Transactional
    public ResponseEntity getTeamStatus(Long userId) {
        Optional<ConnStudy> connStudy = connStudyRepository.findByUser_UserId(userId);
        if(!connStudy.isPresent()) return new ResponseEntity<>(new ResponseDto("empty"), HttpStatus.CONFLICT);

        long studyId = connStudy.get().getStudy().getStudyId();
        List<Object[]> result = subjectRepository.getTeamStatus(studyId);   //쿼리날린 결과
        long userCnt = connStudy.get().getStudy().getConnStudy().size();    //스터디 유저 수
        List<Long> subjectCnts = subjectRepository.getTeamSubjectCount(studyId);//스터디 과제 수(데드라인별로 내림차순)

        /* result print
        for (int i = 0; i < result.size(); i++) {
            for (int j = 0; j < result.get(0).length; j++) {
                System.out.print(result.get(i)[j] + " ");
            }
            System.out.println();
        }*/

        int startIdx = 0;

        Map<String,Object> subjectMap = new HashMap<>();
        List<Map<String,Object>> subjects = new ArrayList<>();
        for (int i = 0; i < subjectCnts.size(); i++) {
            long endIdx = startIdx + subjectCnts.get(i) - 1;

            List<Map<String,Object>> users = new ArrayList<>();
            List<Map<String,Object>> problems = new ArrayList<>();

            for (int j = 0; j < userCnt; j++) {
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("user_id", result.get(j + startIdx)[0]);
                userInfo.put("user_name", result.get(j + startIdx)[1]);
                
                int cnt = 0;
                for (int k = 0; k < subjectCnts.get(i); k++) {
                    if(!result.get(startIdx + j + k * (int)userCnt)[4].toString().equals("0"))
                        cnt++;
                }
                userInfo.put("problem_cnt", cnt);
                users.add(userInfo);
            }
            for (int j = 0; j < subjectCnts.get(i); j++) {
                Map<String, Object> problemInfo = new HashMap<>();
                problemInfo.put("problem_id", result.get(startIdx + j * (int)userCnt)[2]);
                problemInfo.put("problem_name", result.get(startIdx + j * (int)userCnt)[3]);

                List solved = new ArrayList<>();
                for (int k = 0; k < userCnt; k++) {
                    if(!result.get(startIdx + j*(int)userCnt + k)[4].toString().equals("0"))
                        solved.add(true);
                    else solved.add(false);
                }
                problemInfo.put("problem_solved", solved);

                problems.add(problemInfo);
            }

            List deadline = new ArrayList<>();
            DateTimeFormatter parseFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.S");
            DateTimeFormatter returnFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            LocalDateTime startDate = LocalDateTime.parse(result.get(startIdx)[5].toString(), parseFormat).minusHours(9).minusDays(2);
            LocalDateTime endDate = LocalDateTime.parse(result.get(startIdx)[5].toString(), parseFormat).minusHours(9);

            deadline.add(startDate.format(returnFormat));
            deadline.add(endDate.format(returnFormat));

            Map<String, Object> subjectInfo = new HashMap<>();
            subjectInfo.put("problems", problems);
            subjectInfo.put("users", users);
            subjectInfo.put("deadline", deadline);

            subjects.add(subjectInfo);

            startIdx += subjectCnts.get(i) * userCnt;
        }
        subjectMap.put("subjects", subjects);
        subjectMap.put("inProgress", (LocalDateTime.now().isBefore(
                LocalDateTime.parse(result.get(0)[5].toString(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.S")).minusHours(9)
        ))? true : false);

        return new ResponseEntity<>(subjectMap, HttpStatus.OK);
    }

    @Override
    public Map<String, Object> getMyStatus(Long userId, List<Subject> totalSubjectList){
        Map<String, Object> returnMap = new HashMap<>();

        Study studyEntity = studyRepository.findByConnStudy(connStudyRepository.findByUser_UserId(userId).get());

        // 전체 과제 개수
        int totalSubjectSize = totalSubjectList.size();
        // 지금까지 푼 과제 개수
        int solvedSubjectCount = solveRepository.countsolvedSubject(userId, studyEntity.getStudyId());
        returnMap.put("totalSubject", totalSubjectSize);
        returnMap.put("solvedSubject", solvedSubjectCount);

        // 지금까지 푼 스터디 문제 개수
        int solvedStudyProblemCount = 0;

        List<ConnStudy> connStudyList = connStudyRepository.findAllByStudy_StudyId(studyEntity.getStudyId());
        List<User> userList = new ArrayList<>();
        for(ConnStudy connStudy : connStudyList){
            userList.add(connStudy.getUser());
        }

        HashSet<Long> studyProblemIdSet = new HashSet<Long>();
        for(User user : userList){
            List<Solve> solveList = solveRepository.findStudyProblemByUserId(user.getUserId());
            for(Solve solve : solveList){
                studyProblemIdSet.add(solve.getProblem().getProblemId());
                if(user.getUserId() == userId){
                    solvedStudyProblemCount++;
                }
            }
        }

        returnMap.put("totalStudyProblem", studyProblemIdSet.size());
        returnMap.put("solvedStudyProblem", solvedStudyProblemCount);

        return returnMap;
    }

    @Override
    public List<Subject> getTotalSubjectList(Long userId) {
        return subjectRepository.findAllByStudy(
                studyRepository.findByConnStudy(
                    connStudyRepository.findByUser(
                        userRepository.findById(userId).get())));
    }

    @Override
    public Map<String, Integer> getSubjectCountByMonth(List<Subject> totalSubjectList, List<User> userList) {
        Map<String, Integer> totalCountMap = new HashMap<>();
        Map<User, Map<String, Integer>> userCountMap = new HashMap<>();

        for(Subject subject : totalSubjectList){
            String date = subject.getDeadline().toString().substring(0, 7);
            if(totalCountMap.containsKey(date)){
                totalCountMap.put(date, totalCountMap.get(date) + 1);
            } else {
                totalCountMap.put(date, 1);
            }
        }

        for(User user : userList){
            Map<String, Integer> temp = new HashMap<>();
            for(Subject subject : totalSubjectList){
                String date = subject.getDeadline().toString().substring(0, 7);
                Optional<Solve> solve = solveRepository.findByUserAndProblem(user, subject.getProblem());
            }

        }


        return null;
    }
}
