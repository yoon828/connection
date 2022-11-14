package com.ssafy.connection.service;

import com.ssafy.connection.advice.RestException;
import com.ssafy.connection.dto.*;
import com.ssafy.connection.entity.ConnStudy;
import com.ssafy.connection.entity.ConnWorkbook;
import com.ssafy.connection.entity.Problem;
import com.ssafy.connection.entity.Solve;
import com.ssafy.connection.entity.Study;
import com.ssafy.connection.entity.Workbook;
import com.ssafy.connection.repository.*;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import com.ssafy.connection.securityOauth.repository.auth.TokenRepository;
import com.ssafy.connection.securityOauth.repository.user.UserRepository;
import com.ssafy.connection.util.RandomCodeGenerate;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class StudyServiceImpl implements StudyService {

    private String githubToken = null;
    private final String adminGithubToken = "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";
    private WebClient webClient = WebClient.create("https://api.github.com");

    private final UserRepository userRepository;
    private final StudyRepository studyRepository;
    private final ConnStudyRepository connStudyRepository;
    private final TokenRepository tokenRepository;
    private final SolveRepository solveRepository;
    private final SubjectRepository subjectRepository;
    private final WorkbookRepository workbookRepository;
    private final ConnWorkbookRepository connWorkbookRepository;

    public StudyServiceImpl(UserRepository userRepository, StudyRepository studyRepository, ConnStudyRepository connStudyRepository, TokenRepository tokenRepository, SolveRepository solveRepository, SubjectRepository subjectRepository, WorkbookRepository workbookRepository, ConnWorkbookRepository connWorkbookRepository) {
        this.userRepository = userRepository;
        this.studyRepository = studyRepository;
        this.connStudyRepository = connStudyRepository;
        this.tokenRepository = tokenRepository;
        this.solveRepository = solveRepository;
        this.subjectRepository = subjectRepository;
        this.workbookRepository = workbookRepository;
        this.connWorkbookRepository = connWorkbookRepository;
    }

    @Override
    @Transactional
    public StudyInfoReturnDto createStudy(long userId, String studyName) {
        try {
            if (!userRepository.findById(userId).get().isIsmember()) // 깃허브 미연동한 경우
                throw new RestException(HttpStatus.I_AM_A_TEAPOT, "Github is not connected");

            if(studyRepository.findByStudyName(studyName).isPresent())
                throw new RestException(HttpStatus.CONFLICT, "Duplicate study name");

            User userEntity = userRepository.findById(userId).get(); // 로그인 한 사용자 정보
            String studyCode = null; // study 코드

            if (connStudyRepository.findByUser_UserId(userEntity.getUserId()).isPresent()) // 이미 스터디에 가입한 경우
                throw new RestException(HttpStatus.BAD_REQUEST, "Already joined to another study");

            do { // 고유한 study 코드 생성
                studyCode = RandomCodeGenerate.generate().toUpperCase();
            } while (studyRepository.findByStudyCode(studyCode) == null);

            //githubToken = tokenRepository.findByGithubId(userEntity.getGithubId()).get().getGithubToken(); // 스터디장 깃토큰

            String createTeamRequest = "{\"name\":\"" + userEntity.getGithubId() + "\"," +
                    "\"description\":\"" + studyName + "\"," +
                    "\"permission\":\"push\"," +
                    "\"privacy\":\"closed\"}";
            webClient.post()
                    .uri("/orgs/{org}/teams", "co-nnection")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminGithubToken)
                    .bodyValue(createTeamRequest)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();


            String inviteUserRequest = "{\"role\":\"maintainer\"}";
            webClient.put()
                    .uri("/orgs/{org}/teams/{team_slug}/memberships/{username}", "co-nnection",userEntity.getGithubId(), userEntity.getGithubId())
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminGithubToken)
                    .bodyValue(inviteUserRequest)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();

            String createRepositoryRequest = "{\"name\":\"" + userEntity.getGithubId() + "\"," +
//                    "\"description\":\"This is your Study repository\"," +
                    "\"description\":\"\uD83D\uDD25알고리즘 스터디 " + studyName + "\uD83D\uDD25\"," +
                    "\"homepage\":\"https://k7c202.p.ssafy.io\"," +
                    "\"private\":false," +
                    "\"has_issues\":true," +
                    "\"has_projects\":true," +
                    "\"has_wiki\":true}";
            webClient.post()
                    .uri("/orgs/{org}/repos", "co-nnection")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminGithubToken)
                    .bodyValue(createRepositoryRequest)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();

            String connectTeamRepositoryRequest = "{\"permission\":\"push\"}";
            webClient.put()
                    .uri("/orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}","co-nnection",userEntity.getGithubId(), "co-nnection",userEntity.getGithubId())
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminGithubToken)
                    .bodyValue(connectTeamRepositoryRequest)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();

            Study study = new Study();
            study.setStudyCode(studyCode);
            study.setStudyName(studyName);
            study.setStudyRepository("https://github.com/co-nnection/" + userEntity.getGithubId());
            study.setStudyPersonnel(1);
            studyRepository.save(study);
            Study studyEntity = studyRepository.findByStudyCode(studyCode).get();
            ConnStudy connStudy = new ConnStudy();
            connStudy.setRole("LEADER");
            connStudy.setStudy(studyEntity);
            connStudy.setUser(userEntity);
            connStudy.setJoinedDate(LocalDateTime.now());
            connStudyRepository.save(connStudy);
            Workbook workbook = new Workbook();
            workbook.setWorkbookName(study.getStudyName());
            workbook.setStudy(study);
            workbookRepository.save(workbook);
            StudyInfoReturnDto createdStudy = StudyInfoReturnDto.of(study);

            //DB처리 완료 후 리드미생성 비동기 호출
            updateStudyReadme(StudyReadmeDto.builder().studyId(study.getStudyId()).msg("Create study '" + studyName + "'").build());
            return createdStudy;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public StudyDto getStudy(long userId, String studyCode) {
        try {
            User userEntity = userRepository.findById(userId).get(); // 로그인 한 사용자 정보

            if (connStudyRepository.findByUser_UserId(userEntity.getUserId()).isPresent()) // 이미 스터디에 가입한 경우
                throw new RestException(HttpStatus.BAD_REQUEST, "Already joined to another study");

            if (studyRepository.findByStudyCode(studyCode).isEmpty()) // studyCode와 일치하는 결과가 없을 경우 예외처리(찾는 study가 없는 경우)
                throw new RestException(HttpStatus.NOT_FOUND, "Not Found Study");

            Study studyEntity = studyRepository.findByStudyCode(studyCode).get();
            User studyLeaderEntity = connStudyRepository.findByStudy_StudyIdAndRole(studyEntity.getStudyId(),"LEADER").get().getUser();
            StudyDto studyDto = StudyDto.of(studyEntity);
            studyDto.setStudyLeaderName(studyLeaderEntity.getName());

            return studyDto;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void joinStudy(long userId, String studyCode) {
        try {
            User userEntity = userRepository.findById(userId).get(); // 로그인 한 사용자 정보

            if (connStudyRepository.findByUser_UserId(userEntity.getUserId()).isPresent()) // 이미 스터디에 가입한 경우
                throw new RestException(HttpStatus.BAD_REQUEST, "Already joined to another study");

            if (studyRepository.findByStudyCode(studyCode).isEmpty()) // studyCode와 일치하는 결과가 없을 경우 예외처리(찾는 study가 없는 경우)
                throw new RestException(HttpStatus.NOT_FOUND, "Not found study");

            Study studyEntity = studyRepository.findByStudyCode(studyCode).get(); // 참가하려는 study 정보
            ConnStudy connStudyEntity = connStudyRepository.findByStudy_StudyIdAndRole(studyEntity.getStudyId(), "LEADER").get();
            User studyLeaderEntity = connStudyEntity.getUser(); // 참가하려는 스터디 스터디장 정보
            //githubToken = tokenRepository.findByGithubId(studyLeaderEntity.getGithubId()).get().getGithubToken(); // 스터디장 깃토큰

            //if(connStudyRepository.findByUser_UserIdAndStudy_StudyId(userId,studyEntity.getStudyId()).isPresent()) // userId, studyId와 일치하는 결과가 있을 경우 예외처리(이미 가입한 경우)
            //    throw new RestException(HttpStatus.BAD_REQUEST, "Already joined");

            String inviteUserRequest = "{\"role\":\"maintainer\"}";
            webClient.put()
                    .uri("/orgs/{org}/teams/{team_slug}/memberships/{username}",
                            "co-nnection",
                            studyLeaderEntity.getGithubId(),
                            userEntity.getGithubId())
                    .header(HttpHeaders.AUTHORIZATION,
                            "Bearer " + adminGithubToken)
                    .bodyValue(inviteUserRequest)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();

            ConnStudy connStudy = new ConnStudy();
            connStudy.setRole("MEMBER");
            connStudy.setStudy(studyEntity);
            connStudy.setUser(userEntity);
            connStudy.setJoinedDate(LocalDateTime.now());
            connStudyRepository.save(connStudy);
            studyEntity.setStudyPersonnel(studyEntity.getStudyPersonnel()+1);
            studyRepository.save(studyEntity);

            //DB처리 완료 후 리드미수정 비동기 호출
            updateStudyReadme(StudyReadmeDto.builder().studyId(studyEntity.getStudyId()).msg(userEntity.getGithubId() + "has joined '" + studyEntity.getStudyName() + "'").build());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void quitStudy(long userId, Long quitUserId) {
        try {
            User quitUserEntity = null; // 탈퇴/추방하려는 사용자 정보
            ConnStudy connStudyEntity = null;
            User studyLeaderEntity = null; // 스터디 스터디장 정보
            Study studyEntity = null; // 스터디 정보

            if (quitUserId == null) { // 탈퇴하는 경우
                quitUserEntity = userRepository.findById(userId).get();

                if (connStudyRepository.findByUser_UserId(userId).isEmpty()) // userId와 일치하는 결과가 없을 경우 예외처리(참여중인 study가 없는 경우)
                    throw new RestException(HttpStatus.BAD_REQUEST, "No study participated");

                connStudyEntity = connStudyRepository.findByUser_UserId(userId).get();
//안쓰길래                studyLeaderEntity = userRepository.findById(connStudyRepository.findByStudy_StudyIdAndRole(connStudyEntity.getStudy().getStudyId(), "LEADER").get().getUser().getUserId()).get();
                studyEntity = studyRepository.findById(connStudyEntity.getStudy().getStudyId()).get();

                if (connStudyRepository.findByUser_UserIdAndStudy_StudyIdAndRole(userId, studyEntity.getStudyId(), "READER").isPresent()) // userId,studyId,role과 일치하는 결과가 있는 경우 예외처리(탈퇴하려는 사용자가 스터디장인 경우)
                    throw new RestException(HttpStatus.BAD_REQUEST, "Unable to quit because you are leader");
            } else { // 추방하는 경우
                if (userRepository.findById(quitUserId).isEmpty()) // quitUserId 일치하는 결과가 없을 경우 예외처리(추방하려는 사용자가 없는 경우)
                    throw new RestException(HttpStatus.BAD_REQUEST, "Not found user to deport");

                quitUserEntity = userRepository.findById(quitUserId).get();

                if (connStudyRepository.findByUser_UserId(quitUserId).isEmpty()) // quitUserId 일치하는 결과가 없을 경우 예외처리(추방하려는 사용자가 참여중인 study가 없는 경우)
                    throw new RestException(HttpStatus.BAD_REQUEST, "No study participated by user");

                connStudyEntity = connStudyRepository.findByUser_UserId(quitUserId).get();

                if (connStudyRepository.findByUser_UserIdAndStudy_StudyIdAndRole(userId, connStudyEntity.getStudy().getStudyId(), "LEADER").isEmpty())
                    throw new RestException(HttpStatus.BAD_REQUEST, "Not study leader");

//안쓰길래                studyLeaderEntity = userRepository.findById(userId).get();
                studyEntity = studyRepository.findById(connStudyEntity.getStudy().getStudyId()).get();
            }

            if(connStudyRepository.findByUser_UserIdAndStudy_StudyId(quitUserEntity.getUserId(),studyEntity.getStudyId()).isEmpty()) // userId, studyId와 일치하는 결과가 없을 경우 예외처리(study의 스터디원이 아닌 경우)
                throw new RestException(HttpStatus.BAD_REQUEST, "Already not a member");

            //githubToken = tokenRepository.findByGithubId(studyLeaderEntity.getGithubId()).get().getGithubToken();

            webClient.delete()
                    .uri("/orgs/{org}/teams/{team_slug}/memberships/{username}",
                            "co-nnection",
                            studyEntity.getStudyRepository().substring(31),
                            quitUserEntity.getGithubId())
                    .header(HttpHeaders.AUTHORIZATION,
                            "Bearer " + adminGithubToken)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();

            changeSolve(quitUserEntity.getUserId());
            studyEntity.setStudyPersonnel(studyEntity.getStudyPersonnel()-1);
            connStudyRepository.delete(connStudyEntity);
            studyRepository.save(studyEntity);

            //DB처리 완료 후 리드미수정 비동기 호출
            updateStudyReadme(StudyReadmeDto.builder().studyId(studyEntity.getStudyId()).msg(quitUserEntity.getGithubId() + "has quit '" + studyEntity.getStudyName() + "'").build());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void deleteStudy(long userId) {
        User userEntity = userRepository.findById(userId).get();

        if (connStudyRepository.findByUser_UserIdAndRole(userId, "LEADER").isEmpty()) // userId, LEADER와 일치하는 결과가 없을 경우 예외처리(찾는 study가 없는 경우)
            throw new RestException(HttpStatus.BAD_REQUEST, "Not found study");

        githubToken = tokenRepository.findByGithubId(userEntity.getGithubId()).get().getGithubToken();

        webClient.delete()
                .uri("/orgs/{org}/teams/{team_slug}",
                        "co-nnection",
                        userEntity.getGithubId())
                .header(HttpHeaders.AUTHORIZATION,
                        "Bearer " + adminGithubToken)
                .retrieve()
                .bodyToMono(Void.class)
                .block();

        webClient.delete()
                .uri("/repos/{owner}/{repo}",
                        "co-nnection",
                        userEntity.getGithubId())
                .header(HttpHeaders.AUTHORIZATION,
                        "Bearer " + adminGithubToken)
                .retrieve()
                .bodyToMono(Void.class)
                .block();
        
        ConnStudy connStudyEntity = connStudyRepository.findByUser_UserIdAndRole(userId, "LEADER").get();
        Study studyEntity = studyRepository.findById(connStudyEntity.getStudy().getStudyId()).get(); // 스터디 정보
        Workbook workbookEntity = workbookRepository.findByStudy(studyEntity).get();
        List<ConnStudy> connStudyList = connStudyRepository.findAllByStudy_StudyId(studyEntity.getStudyId());

        for (ConnStudy connStudy : connStudyList) {
            changeSolve(connStudy.getUser().getUserId());
        }

        connWorkbookRepository.deleteAllByWorkbook(workbookEntity);
        workbookRepository.deleteAllByStudy(studyEntity);
        subjectRepository.deleteAllByStudy(studyEntity);
        connStudyRepository.deleteAllByStudy(studyEntity);
        studyRepository.delete(studyEntity);
    }

    @Transactional
    public boolean changeSolve(long userId){
        Optional<User> userEntityOptional = userRepository.findById(userId);
        if(userEntityOptional.isPresent()){
            User userEntity = userEntityOptional.get();
            // 유저의 과제, 스터디 solve entity를 가져온다.
            List<Solve> solveList = solveRepository.findUncommonSolveByUserId(userId);
            // 유저의 과제, 스터디 solve entity list를 돌면서
            // 해당 solve entity의 userId와 problemId로 조회되는 일반 solve entity가 있으면 과제, 스터디 solve entity를 삭제
            // 조회되지 않으면 status를 2로 바꿔서 update
            for(Solve solveEntity : solveList){
                Optional<Solve> solveCheck = solveRepository.findNormalByUserAndProblem(userEntity.getUserId(), solveEntity.getProblem().getProblemId());
                if(solveCheck.isPresent()){
                    solveRepository.delete(solveEntity);
                } else {
                    solveEntity.setStatus(2);
                    solveRepository.save(solveEntity);
                }
            }
        } else {
            return false;
        }
        return true;
    }

    @Override
    @Transactional
    public int getStudyTier(long userId) {
        ConnStudy connStudy = connStudyRepository.findByUser_UserId(userId).get();
        List<ConnStudy> connStudyList = connStudyRepository.findAllByStudy_StudyId(connStudy.getStudy().getStudyId());

        int avgTier = 0;
        for(ConnStudy temp : connStudyList){
            avgTier += temp.getUser().getTier();
        }
        avgTier = Math.round(avgTier / connStudyList.size());
        return avgTier;
    }

    @Override
    @Transactional
    public Map<String, Object> getStudyStreak(long userId) {
        User userEntity = userRepository.findById(userId).get();
        ConnStudy connStudyEntity = connStudyRepository.findByUser_UserId(userId).get();
        Study studyEntity = studyRepository.findById(connStudyEntity.getStudy().getStudyId()).get();

        List<SolveStudyDto> solveStudyList = new ArrayList<>();
        List<SolveStudyInterface> solveStudy = solveRepository.findStudyStreakByStudyId(studyEntity.getStudyId());
        Map<String, Object> map = new HashMap<>();

        for (SolveStudyInterface solveStudyInterface : solveStudy) {
            solveStudyList.add(new SolveStudyDto(solveStudyInterface.getDate(), solveStudyInterface.getCount()));
        }

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(155);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");

        map.put("studyPersonnel", studyEntity.getStudyPersonnel());
        map.put("startDate", startDate.format(formatter));
        map.put("endDate", endDate.format(formatter));
        map.put("data", solveStudyList);

        return map;
    }

    @Override
    @Transactional
    public Map<String, Object> getStudyRanking() {

        List<StudyRankingDto> studyRankingList = new ArrayList<>();
        List<StudyRankingInterface> studyRanking = studyRepository.findStudyRanking();
        Map<String, Object> map = new HashMap<>();

        int ranking = 0;
        int add = 1;
        int beforeScore = -1;

        for (StudyRankingInterface studyInterface : studyRanking) {
            StudyRankingDto studyRankingDto = null;

            if (studyInterface.getTotalScore()==beforeScore) { // 이전과 동점인 경우
                studyRankingDto = new StudyRankingDto(studyInterface.getStudyName(),
                        studyInterface.getStudyId(),
                        studyInterface.getStudyRepository(),
                        studyInterface.getStudyScore(),
                        studyInterface.getSubjectScore(),
                        studyInterface.getBonusScore(),
                        studyInterface.getTotalScore(),
                        ranking);

                add++;
            }
            else { // 동점 아닐 경우
                studyRankingDto = new StudyRankingDto(studyInterface.getStudyName(),
                        studyInterface.getStudyId(),
                        studyInterface.getStudyRepository(),
                        studyInterface.getStudyScore(),
                        studyInterface.getSubjectScore(),
                        studyInterface.getBonusScore(),
                        studyInterface.getTotalScore(),
                        ranking+add);

                ranking += add;
                add = 1;
            }

            beforeScore = studyInterface.getTotalScore();
            studyRankingList.add(studyRankingDto);
        }

        map.put("data", studyRankingList);

        return map;
    }

    @Override
    @Transactional
    public List<SolveStudyMemberListDto> getStudyMember(long userId) {
        User userEntity = userRepository.findById(userId).get();
        ConnStudy connStudyEntity = connStudyRepository.findByUser_UserId(userEntity.getUserId()).get();
        Study studyEntity = studyRepository.findByConnStudy(connStudyEntity);

        List<ConnStudy> studyMemberList = connStudyRepository.findAllByStudy_StudyId(studyEntity.getStudyId()); // 스터디의 스터디원 정보 리스트로 저장
        ArrayList<SolveStudyMemberListDto> result = new ArrayList<>(); // 최종적으로 반환할 결과값
        Map<String, Float> solveProblemAvgMap = new HashMap<>();
        Map<String, Float> solveSubjectAvgMap = new HashMap<>();

        for (ConnStudy connStudy : studyMemberList) { // 각각의 스터디원별로
            long selectUserId = connStudy.getUser().getUserId(); // 현재 스터디원의 userId
            User selectUserEntity = userRepository.findById(selectUserId).get(); // 현재 스터디원 정보

            List<SolveStudyMemberDto> solveStudyMemberList = new ArrayList<>(); // 월별 스터디원 문제풀이 현황 정보 저장
            List<GetDateAndCountInterface> solveProblemList = solveRepository.findSolveProblemByUserId(selectUserId); // 월별 함께 푼 문제 제출 현황 정보 가져오기
            List<GetDateAndCountInterface> solveSubjectList = solveRepository.findSolveSubjectByUserId(selectUserId); // 월별 과제 제출 현황 정보 가져오기

            Map<String, Integer> solveProblemMap = new HashMap<>();
            Map<String, Integer> solveSubjectMap = new HashMap<>();

            for (GetDateAndCountInterface getDateAndCountInterface : solveProblemList) {
                solveProblemMap.put(getDateAndCountInterface.getDate().toString(), getDateAndCountInterface.getCount());
                if (solveProblemAvgMap.containsKey(getDateAndCountInterface.getDate().toString())) {
                    float lastvalue = solveProblemAvgMap.get(getDateAndCountInterface.getDate().toString());
                    solveProblemAvgMap.replace(getDateAndCountInterface.getDate().toString(), getDateAndCountInterface.getCount() + lastvalue);
                }
                else {
                    solveProblemAvgMap.put(getDateAndCountInterface.getDate().toString(), (float) getDateAndCountInterface.getCount());
                }
                System.out.println(getDateAndCountInterface.getDate().toString());
            }

            for (GetDateAndCountInterface getDateAndCountInterface : solveSubjectList) {
                solveSubjectMap.put(getDateAndCountInterface.getDate().toString(), getDateAndCountInterface.getCount());
                if (solveSubjectAvgMap.containsKey(getDateAndCountInterface.getDate().toString())) {
                    float lastvalue = solveSubjectAvgMap.get(getDateAndCountInterface.getDate().toString());
                    solveSubjectAvgMap.replace(getDateAndCountInterface.getDate().toString(), getDateAndCountInterface.getCount() + lastvalue);
                }
                else {
                    solveSubjectAvgMap.put(getDateAndCountInterface.getDate().toString(), (float) getDateAndCountInterface.getCount());
                }
            }

            LocalDate now = LocalDate.now().minusDays(LocalDate.now().getDayOfMonth()-1);

            for (int i=5; i>-1; i--) {
                float problemCnt = 0;
                float subjectCnt = 0;

                if (solveProblemMap.containsKey(now.minusMonths(i).toString())) {
                    problemCnt = solveProblemMap.get(now.minusMonths(i).toString());
                }
                if (solveSubjectMap.containsKey(now.minusMonths(i).toString())) {
                    subjectCnt = solveSubjectMap.get(now.minusMonths(i).toString());
                }

                solveStudyMemberList.add(new SolveStudyMemberDto(now.minusMonths(i), problemCnt, subjectCnt, (float)0, (float)0));
            }

            SolveStudyMemberListDto solveStudyMemberListDto = new SolveStudyMemberListDto(selectUserId, selectUserEntity.getName(), selectUserEntity.getImageUrl(), solveStudyMemberList);
            result.add(solveStudyMemberListDto);
        }

        for (int i=0; i<result.size(); i++) {
            List<SolveStudyMemberDto> selectSeries = result.get(i).getSeries();
            for (int j=0; j<selectSeries.size(); j++) {
                if(solveProblemAvgMap.containsKey(selectSeries.get(j).getDate().toString())) {
                    selectSeries.get(j).setProblemAvgCnt((float) (Math.round(solveProblemAvgMap.get(selectSeries.get(j).getDate().toString())/studyEntity.getStudyPersonnel()*10)/10.0));
                }
                if(solveSubjectAvgMap.containsKey(selectSeries.get(j).getDate().toString())) {
                    selectSeries.get(j).setSubjectAvgCnt((float) (Math.round(solveSubjectAvgMap.get(selectSeries.get(j).getDate().toString())/studyEntity.getStudyPersonnel()*10)/10.0));
                }
            }
        }

        return result;
    }

    @Override
    public void ckeckStudy(long userId, String studyName) {
        try {
            if (!userRepository.findById(userId).get().isIsmember()) // 깃허브 미연동한 경우
                throw new RestException(HttpStatus.I_AM_A_TEAPOT, "Github is not connected");

            if(studyRepository.findByStudyName(studyName).isPresent())
                throw new RestException(HttpStatus.CONFLICT, "Duplicate study name");

            User userEntity = userRepository.findById(userId).get(); // 로그인 한 사용자 정보
            String studyCode = null; // study 코드

            if (connStudyRepository.findByUser_UserId(userEntity.getUserId()).isPresent()) // 이미 스터디에 가입한 경우
                throw new RestException(HttpStatus.BAD_REQUEST, "Already joined to another study");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @EventListener
    @Async
    @Override
    @Transactional
    public ResponseEntity updateStudyReadme(StudyReadmeDto studyReadmeDto){
        Optional<Study> study = studyRepository.findById(studyReadmeDto.getStudyId());
        if(!study.isPresent()) return new ResponseEntity(new ResponseDto("empty"),HttpStatus.CONFLICT);
        List<ConnStudy> connStudyList = study.get().getConnStudy();
        ConnStudy leaderConnStudy = connStudyRepository.findByStudy_StudyIdAndRole(studyReadmeDto.getStudyId(), "LEADER").get();
        String githubId = leaderConnStudy.getUser().getGithubId();
        String githubToken = tokenRepository.findByGithubId(githubId).get().getGithubToken();

        System.out.println(githubId);

        //파일 처리
        String exampleCode = "<div><img src=\"https://user-images.githubusercontent.com/116149736/200574871-cf4ba89d-73f1-461e-adb7-7dd300720fff.jpg\" width=\"1000\"/>\n\n";

        exampleCode += "<div align=center>\n\n";

        //제목
        exampleCode += "## \uD83D\uDCBB" + study.get().getStudyName() + "\n" +
                "우리는 함께 성장하며 보다 높은 곳을 바라보는 알고리즘 스터디 " + study.get().getStudyName() + "입니다.<br>" +
                "[\\<connection/> 바로가기](https://k7c202.p.ssafy.io/)\n<br><br><br>";

        //멤버시작======================================================
        exampleCode += "## \uD83D\uDD25 스터디 멤버"
                        + "<table>\n<tr>";
        //리더 먼저 표시
        exampleCode += "<td align=\"center\"><a href=\"https://github.com/" + leaderConnStudy.getUser().getGithubId() + "\">" +
                "<img src=\"" + leaderConnStudy.getUser().getImageUrl() + "\" width=\"100px;\" alt=\"\"/><br />" +
                "<sub><b>\uD83D\uDC51" + leaderConnStudy.getUser().getName() + "</b></a><br><a href=\"https://solved.ac/profile/" + leaderConnStudy.getUser().getBackjoonId() + "\">" +
                "<img src=\"http://mazassumnida.wtf/api/mini/generate_badge?boj=" + leaderConnStudy.getUser().getBackjoonId() + "\" /></sub></a><br /></td>";

        //나머지 멤버
        for (int i = 0; i < connStudyList.size(); i++) {
            if(connStudyList.get(i).getRole().equals("LEADER")) continue;    //멤버들만 표시
            System.out.println(connStudyList.get(i).getRole());
            exampleCode += "<td align=\"center\"><a href=\"https://github.com/" + connStudyList.get(i).getUser().getGithubId() + "\">" +
                    "<img src=\"" + connStudyList.get(i).getUser().getImageUrl() + "\" width=\"100px;\" alt=\"\"/><br />" +
                    "<sub><b>" + connStudyList.get(i).getUser().getName() + "</b></a><br><a href=\"https://solved.ac/profile/" + connStudyList.get(i).getUser().getBackjoonId() + "\">" +
                    "<img src=\"http://mazassumnida.wtf/api/mini/generate_badge?boj=" + connStudyList.get(i).getUser().getBackjoonId() + "\" /></sub></a><br /></td>";
        }
        exampleCode += "</table>\n<br><br><br>";
        //멤버소개 끝 =====================================================

        //과제
        exampleCode += "## \uD83D\uDCBB과제\n" +
                "![과제](https://www.coalla.co.kr/api/svg/"+ study.get().getStudyName() + ")\n<br><br><br>";
        exampleCode += "\n</div>\n";
        exampleCode += "\n<div><img src=\"https://user-images.githubusercontent.com/116149736/200578139-c971c35c-12fb-4f41-a730-db93e0301797.jpg\" width=\"1000\"/>";
        String code = new String(Base64.encodeBase64(exampleCode.getBytes()));
        String fileName = "README.md";
        String createFileRequest = "{\"message\":\"" + studyReadmeDto.getMsg() + " via \'<connection/>\'" + "\"," +
                "\"content\":\""+ code +"\"}";

        try {
            webClient.put()
                    .uri("/repos/{owner}/{repo}/contents/{file}", "co-nnection", githubId, fileName)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + githubToken)
                    .bodyValue(createFileRequest)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();
        }
        catch (WebClientResponseException e) {
            System.out.println("한번터짐 " + e);
            if(e.getStatusCode().equals(HttpStatus.UNPROCESSABLE_ENTITY)){
                //422 터졌으니 레포에서 Get해서 SHA값 가져오기 (수정할땐 필요함)
                Map<String, Object> contents = (Map<String, Object>)webClient.get()
                        .uri("repos/{owner}/{repo}/contents/{file}", "co-nnection", githubId, fileName)
                        .retrieve()
                        .bodyToMono(Object.class)
                        .block();
                String sha = contents.get("sha").toString();
                createFileRequest = "{" +
                        "\"message\":\"" + studyReadmeDto.getMsg() +" via \'<connection/>\'" + "\","
                        + "\"content\":\""+ code +"\","
                        + "\"sha\":\"" + sha + "\""
                        + "}";
                try {
                    webClient.put()
                            .uri("/repos/{owner}/{repo}/contents/{file}", "co-nnection", githubId, fileName)
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + githubToken)
                            .bodyValue(createFileRequest)
                            .retrieve()
                            .bodyToMono(Void.class)
                            .block();
                }
                catch (WebClientResponseException e2) {
                    if(e2.getStatusCode().equals(HttpStatus.CONFLICT))
                        return new ResponseEntity<>(new ResponseDto("same content"), HttpStatus.CONFLICT);
                    System.out.println("같은 내용이라 업뎃 안됨" +e2);
                    System.out.println(githubToken);
                    System.out.println(sha);
                    System.out.println(createFileRequest);
                }

            }
            else return new ResponseEntity(new ResponseDto(e.getMessage()),HttpStatus.CONFLICT);
        }


        return new ResponseEntity(new ResponseDto("success"),HttpStatus.OK);
    }

    @Transactional
    @Override
    public ResponseEntity getStudyMemberList(Long userId){
        Optional<ConnStudy> connStudy = connStudyRepository.findByUser_UserId(userId);

        if(connStudy.isPresent()){
            List<Map<String,Object>> mapList = new ArrayList<>();
            List<ConnStudy> memberList = connStudyRepository.findAllByStudy_StudyId(connStudy.get().getStudy().getStudyId());
            System.out.println(memberList.size());
            for(ConnStudy cs:memberList){
                Map<String,Object> map = new HashMap<>();
                System.out.println(cs.getUser().getName() + cs.getUser().getUserId() + cs.getUser().getImageUrl() + cs.getUser().getGithubId());
                map.put("name", cs.getUser().getName());
                map.put("userId", cs.getUser().getUserId());
                map.put("imageUrl", cs.getUser().getImageUrl());
                map.put("githubId", cs.getUser().getGithubId());

                mapList.add(map);
            }
            return ResponseEntity.ok((mapList));
        }

        return new ResponseEntity(new ResponseDto("empty"),HttpStatus.CONFLICT);
    }
}
