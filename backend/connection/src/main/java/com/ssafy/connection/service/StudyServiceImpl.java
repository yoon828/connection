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
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
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
                studyCode = RandomCodeGenerate.generate();
            } while (studyRepository.findByStudyCode(studyCode) == null);

            //githubToken = tokenRepository.findByGithubId(userEntity.getGithubId()).get().getGithubToken(); // 스터디장 깃토큰

            String createTeamRequest = "{\"name\":\"" + userEntity.getGithubId() + "\"," +
                    "\"description\":\"This is your study repository\"," +
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
                    "\"description\":\"This is your Study repository\"," +
                    "\"homepage\":\"https://github.com\"," +
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
            connStudyRepository.save(connStudy);
            Workbook workbook = new Workbook();
            workbook.setWorkbookName(study.getStudyName());
            workbook.setStudy(study);
            workbookRepository.save(workbook);
            StudyInfoReturnDto createdStudy = StudyInfoReturnDto.of(study);
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
            connStudyRepository.save(connStudy);
            studyEntity.setStudyPersonnel(studyEntity.getStudyPersonnel()+1);
            studyRepository.save(studyEntity);
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

                if (connStudyRepository.findByUser_UserIdAndStudy_StudyIdAndRole(userId, connStudyEntity.getStudy().getStudyId(), "READER").isEmpty())
                    throw new RestException(HttpStatus.BAD_REQUEST, "Not study reader");

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
        int add = 0;
        int beforeScore = 0;

        for (StudyRankingInterface studyInterface : studyRanking) {
            StudyRankingDto studyRankingDto = new StudyRankingDto(studyInterface.getStudyName(), studyInterface.getStudyId(), studyInterface.getStudyPersonnel(), studyInterface.getStudyScore(), studyInterface.getHomeworkScore(), studyInterface.getTotalScore(), ranking + add, studyInterface.getStudyRepository());

            if (beforeScore != studyInterface.getTotalScore()) {
                ranking++;
                studyRankingDto.setRanking(ranking + add);
                add = 0;
            }
            else {
                studyRankingDto.setRanking(ranking);
                add++;
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

        Map<String, GetDateAndCountDto> studySubjectMap = new HashMap<>(); // 월별 스터디 과제 수 정보 저장
        List<GetDateAndCountInterface> studySubject = subjectRepository.findStudySubject(studyEntity.getStudyId()); // DB에서 월별 스터디 과제 수 가져오기
        for (GetDateAndCountInterface getDateAndCountInterface : studySubject) {
            studySubjectMap.put(getDateAndCountInterface.getDate().toString(), new GetDateAndCountDto(getDateAndCountInterface.getDate(), getDateAndCountInterface.getCount()));
        }

        Map<String, GetDateAndCountDto> studyProblemMap = new HashMap<>(); // 월별 스터디 함께 푼 문제 수 정보 저장
        List<GetDateAndCountInterface> studyProblem = solveRepository.findStudyProblemByStudyId(studyEntity.getStudyId()); // DB에서 월별 스터디 함께 푼 문제 수 가져오기
        for (GetDateAndCountInterface getDateAndCountInterface : studyProblem) {
            studyProblemMap.put(getDateAndCountInterface.getDate().toString(), new GetDateAndCountDto(getDateAndCountInterface.getDate(), getDateAndCountInterface.getCount()));
        }

        Map<String, GetDateAndCountFloatDto> studyAvgSolveMap = new HashMap<>(); // 월별 스터디원 평균 해결 문제 수 정보 저장
        List<GetDateAndCountFloatInterface> studyAvgSolve = solveRepository.findStudyAvgSolveByStudyId(studyEntity.getStudyId()); // DB에서 월별 스터디 함께 푼 문제 수 가져오기
        for (GetDateAndCountFloatInterface getDateAndCountFloatInterface : studyAvgSolve) {
            studyAvgSolveMap.put(getDateAndCountFloatInterface.getDate().toString(), new GetDateAndCountFloatDto(getDateAndCountFloatInterface.getDate(), getDateAndCountFloatInterface.getCount()));
        }

        for (ConnStudy connStudy : studyMemberList) { // 각각의 스터디원별로
            long selectUserId = connStudy.getUser().getUserId(); // 현재 스터디원의 userId
            User selectUserEntity = userRepository.findById(selectUserId).get(); // 현재 스터디원 정보

            List<SolveStudyMemberDto> solveStudyMemberList = new ArrayList<>(); // 월별 스터디원 문제풀이 현황 정보 저장
            List<GetDateAndCountInterface> solveStudyMember = solveRepository.findStudyMemberRecordByStudyIdAndUserId(studyEntity.getStudyId(), selectUserId); // DB에서 월별 스터디원 문제풀이 현황 정보 가져오기

            for (GetDateAndCountInterface getDateAndCountInterface : solveStudyMember) {
                // 월별 Total 갯수 구하기 위한 logic
                GetDateAndCountDto studySubjectDto = null;
                GetDateAndCountDto studyProblemDto = null;

                // DB에 더미 데이터에서 발생한 오류 때문에 사용한거라 실제는 필요 없을듯!
                if (studySubjectMap.containsKey(getDateAndCountInterface.getDate().toString())) {
                    studySubjectDto = studySubjectMap.get(getDateAndCountInterface.getDate().toString());
                }
                else {
                    studySubjectDto = new GetDateAndCountDto(LocalDate.now(), 0);
                }
                if (studyProblemMap.containsKey(getDateAndCountInterface.getDate().toString())) {
                    studyProblemDto = studyProblemMap.get(getDateAndCountInterface.getDate().toString());
                }
                else {
                    studyProblemDto = new GetDateAndCountDto(LocalDate.now(), 0);
                }
                //

                // 월별 평균 Solve 갯수 구하기 위한 logic
                GetDateAndCountFloatDto studyAvgSolveDto = null;
                if (studyAvgSolveMap.containsKey(getDateAndCountInterface.getDate().toString())) {
                    studyAvgSolveDto = studyAvgSolveMap.get(getDateAndCountInterface.getDate().toString());
                }
                else {
                    studyAvgSolveDto = new GetDateAndCountFloatDto(LocalDate.now(), 0);
                }
                //

                solveStudyMemberList.add(new SolveStudyMemberDto(getDateAndCountInterface.getDate(), getDateAndCountInterface.getCount(), studySubjectDto.getCount()+studyProblemDto.getCount(), studyAvgSolveDto.getCount()));
            }

            // 해당 월에 과제가 존재하는데 들어가지 않은 경우 체크하기 위한 logic
            for (String key : studySubjectMap.keySet()) {
                boolean check= false; // 정보가 있는지 체크하기 위한 변수

                for (int i=0; i<solveStudyMemberList.size(); i++) {
                    if(key.equals(solveStudyMemberList.get(i).getDate().toString())) { // 해당 정보가 있는 경우
                        check = true; // 상태 변경
                        break; // 종료
                    }
                }

                if (!check) { // 해당 정보가 없는 경우
                    // 월별 평균 Solve 갯수 구하기 위한 logic
                    GetDateAndCountFloatDto studyAvgSolveDto = null;
                    if (studyAvgSolveMap.containsKey(studySubjectMap.get(key).getDate().toString())) {
                        studyAvgSolveDto = studyAvgSolveMap.get(studySubjectMap.get(key).getDate().toString());
                    }
                    else {
                        studyAvgSolveDto = new GetDateAndCountFloatDto(LocalDate.now(), 0);
                    }
                    //

                    solveStudyMemberList.add(new SolveStudyMemberDto(studySubjectMap.get(key).getDate(), 0, studySubjectMap.get(key).getCount(), studyAvgSolveDto.getCount()));
                }
            }
            //

            SolveStudyMemberListDto solveStudyMemberListDto = new SolveStudyMemberListDto(selectUserId, selectUserEntity.getName(), solveStudyMemberList);
            result.add(solveStudyMemberListDto);
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

}
