package com.ssafy.connection.service;

import com.ssafy.connection.dto.GitPushDto;
import com.ssafy.connection.dto.ResponseDto;
import com.ssafy.connection.dto.SolvedacUserDto;
import com.ssafy.connection.dto.SubjectDto;
import com.ssafy.connection.entity.ConnStudy;
import com.ssafy.connection.entity.Solve;
import com.ssafy.connection.entity.Study;
import com.ssafy.connection.entity.Subject;
import com.ssafy.connection.repository.*;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import com.ssafy.connection.securityOauth.repository.auth.TokenRepository;
import com.ssafy.connection.securityOauth.repository.user.UserRepository;
import org.apache.commons.io.FilenameUtils;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.io.IOException;
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
    private final TokenRepository tokenRepository;

    private WebClient webClient = WebClient.create("https://api.github.com");


    public SubjectServiceImpl(SubjectRepository subjectRepository, StudyRepository studyRepository, ProblemRepository problemRepository,
                              ConnStudyRepository connStudyRepository, UserRepository userRepository, SolveRepository solveRepository, TokenRepository tokenRepository){
        this.subjectRepository = subjectRepository;
        this.studyRepository = studyRepository;
        this.problemRepository = problemRepository;
        this.connStudyRepository = connStudyRepository;
        this.userRepository = userRepository;
        this.solveRepository = solveRepository;
        this.tokenRepository = tokenRepository;
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

        LocalDateTime now = LocalDateTime.now();

        for(int i = 0; i<problemList.size(); i++){
            Subject subject = new Subject();
            subject.setStart(now);
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

        // result print
//        for (int i = 0; i < result.size(); i++) {
//            for (int j = 0; j < result.get(0).length; j++) {
//                System.out.print(result.get(i)[j] + ",, ");
//            }
//            System.out.println();
//        }

        int startIdx = 0;

        if(result.isEmpty()) {  //결과값없을때
            Map<String,Object> subjectMap_empty = new HashMap<>();
            List<Map<String,Object>> subjects = new ArrayList<>();
            subjectMap_empty.put("subjects", subjects);
            subjectMap_empty.put("inProgress",false);
            return new ResponseEntity<>(subjectMap_empty, HttpStatus.OK);
        }

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

            LocalDateTime startDate = LocalDateTime.parse(result.get(startIdx)[6].toString(), parseFormat).minusHours(9);
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

    @Override
    @Transactional
    public ResponseEntity submitSubject(GitPushDto gitPushDto) throws IOException {

//        Optional<ConnStudy> connStudy = connStudyRepository.findByUser_UserId(userId);
        User user = userRepository.findByBackjoonId(gitPushDto.getUserId());
        if(user == null || !user.isIsmember()) return new ResponseEntity(new ResponseDto("empty"),HttpStatus.CONFLICT);
        Optional<ConnStudy> connStudy = connStudyRepository.findByUser_UserId(user.getUserId());
        if(!connStudy.isPresent()) return new ResponseEntity<>(new ResponseDto("empty"), HttpStatus.CONFLICT);
        long studyId = connStudy.get().getStudy().getStudyId();
        String repositoryName = connStudyRepository.findByStudy_StudyIdAndRole(studyId, "LEADER").get().getUser().getGithubId();
        String githubId = connStudy.get().getUser().getGithubId();
        String githubToken = tokenRepository.findByGithubId(githubId).get().getGithubToken();

        //파일 처리
        String problemNo = gitPushDto.getProblemNo();
        String code = new String(Base64.encodeBase64(gitPushDto.getCode().getBytes()));
        String fileName = problemNo + "_" + githubId + "." + gitPushDto.getLang();
        
        String createFileRequest = "{\"message\":\"" + "메세지" + "\"," +
                "\"content\":\""+ code +"\"}";

        try {
            webClient.put()
                    .uri("/repos/{owner}/{repo}/contents/{path}/{file}", "co-nnection", repositoryName, problemNo, fileName)
//                    .uri("/repos/{owner}/{repo}/contents/{path}/{file}", "lastbest", "test2", "gidd1Id", "test.md")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + githubToken)
                    .bodyValue(createFileRequest)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();
        }
        catch (WebClientResponseException e) {
            if(e.getStatusCode().equals(HttpStatus.UNPROCESSABLE_ENTITY)){
                //422 터졌으니 레포에서 Get 가져오자요 번호있는지
                List<Map<String, Object>> contents = (List<Map<String, Object>>)webClient.get()
                                            .uri("repos/{owner}/{repo}/contents/{path}", "co-nnection", repositoryName, problemNo)
                                            .retrieve()
                                            .bodyToMono(Object.class)
                                            .block();

                int cnt = 0;
                for (Map<String,Object> map:contents) {
                    String name_t = map.get("name").toString();
//                    name_t.substring(0,problemNo.length());

                    String fname = name_t.substring(0,problemNo.length()+githubId.length()+1);
                    String noext = FilenameUtils.getBaseName(name_t);
                    String ext = FilenameUtils.getExtension(name_t);
                    if(fname.equals(problemNo + "_" + githubId) && ext.equals(gitPushDto.getLang())){
                        int no = 0;
                        if(noext.length() <= problemNo.length()+githubId.length()+1)
                            no = 1;
                        else
                            no = Integer.parseInt(noext.substring(problemNo.length()+githubId.length()+2));
                        if(no>=cnt) cnt = no+1;
                    }
                }

                String fileName_alt = problemNo + "_" + githubId + "_" + cnt + "." + gitPushDto.getLang();
                try {
                    webClient.put()
                            .uri("/repos/{owner}/{repo}/contents/{path}/{file}", "co-nnection", repositoryName, problemNo, fileName_alt)
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + githubToken)
                            .bodyValue(createFileRequest)
                            .retrieve()
                            .bodyToMono(Void.class)
                            .block();
                }
                catch (WebClientResponseException e2) {
                    System.out.println("답이없네용");
                }

            }
            else return new ResponseEntity(new ResponseDto(e.getMessage()),HttpStatus.CONFLICT);
        }


        return new ResponseEntity(new ResponseDto("success"),HttpStatus.OK);
    }

}
