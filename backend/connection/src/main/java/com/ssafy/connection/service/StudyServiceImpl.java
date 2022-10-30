package com.ssafy.connection.service;

import com.ssafy.connection.advice.RestException;
import com.ssafy.connection.dto.StudyDto;
import com.ssafy.connection.entity.ConnStudy;
import com.ssafy.connection.entity.Study;
import com.ssafy.connection.repository.ConnStudyRepository;
import com.ssafy.connection.repository.StudyRepository;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import com.ssafy.connection.securityOauth.repository.auth.TokenRepository;
import com.ssafy.connection.securityOauth.repository.user.UserRepository;
import com.ssafy.connection.util.RandomCodeGenerate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.List;

@Service
public class StudyServiceImpl implements StudyService {

    private String githubToken = null;
    private final String adminGithubToken = "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";
    private WebClient webClient = WebClient.create("https://api.github.com");

    private final UserRepository userRepository;
    private final StudyRepository studyRepository;
    private final ConnStudyRepository connStudyRepository;
    private final TokenRepository tokenRepository;

    public StudyServiceImpl(UserRepository userRepository, StudyRepository studyRepository, ConnStudyRepository connStudyRepository, TokenRepository tokenRepository) {
        this.userRepository = userRepository;
        this.studyRepository = studyRepository;
        this.connStudyRepository = connStudyRepository;
        this.tokenRepository = tokenRepository;
    }

    @Override
    @Transactional
    public void createStudy(long userId, StudyDto studyDto) {
        try {
            User userEntity = userRepository.findById(userId).get(); // 로그인 한 사용자 정보
            String studyName = studyDto.getStudyName(); // study 이름
            String studyCode = null; // study 코드

            if (connStudyRepository.findByUser_UserId(userEntity.getUserId()).isPresent())
                throw new RestException(HttpStatus.BAD_REQUEST, "Already joined to another study");

            do { // 고유한 study 코드 생성
                studyCode = RandomCodeGenerate.generate();
            } while (studyRepository.findByStudyCode(studyCode) == null);

            githubToken = tokenRepository.findByGithubId(userEntity.getGithubId()).get().getGithubToken(); // 스터디장 깃토큰

            String createTeamRequest = "{\"name\":\"" + userEntity.getGithubId() + "\"," +
                    "\"description\":\"This is your study repository\"," +
                    "\"permission\":\"push\"," +
                    "\"privacy\":\"closed\"}";
            webClient.post()
                    .uri("/orgs/{org}/teams", "co-nnection")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + githubToken)
                    .bodyValue(createTeamRequest)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();

            /*
            String inviteUserRequest = "{\"role\":\"maintainer\"}";

            webClient.put()
                    .uri("/orgs/{org}/teams/{team_slug}/memberships/{username}", "co-nnection",userEntity.getGithubId(), userEntity.getGithubId())
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + githubToken)
                    .bodyValue(inviteUserRequest)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();
             */

            String createRepositoryRequest = "{\"name\":\"" + userEntity.getGithubId() + "\"," +
                    "\"description\":\"This is your Study repository\"," +
                    "\"homepage\":\"https://github.com\"," +
                    "\"private\":false," +
                    "\"has_issues\":true," +
                    "\"has_projects\":true," +
                    "\"has_wiki\":true}";
            webClient.post()
                    .uri("/orgs/{org}/repos", "co-nnection")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + githubToken)
                    .bodyValue(createRepositoryRequest)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();

            String connectTeamRepositoryRequest = "{\"permission\":\"push\"}";
            webClient.put()
                    .uri("/orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}","co-nnection",userEntity.getGithubId(), "co-nnection",userEntity.getGithubId())
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + githubToken)
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
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public StudyDto getStudy(String studyCode) {
        try {
            if (studyRepository.findByStudyCode(studyCode).isEmpty()) // studyCode와 일치하는 결과가 없을 경우 예외처리(찾는 study가 없는 경우)
                throw new RestException(HttpStatus.NOT_FOUND, "Not Found Study");

            Study studyEntity = studyRepository.findByStudyCode(studyCode).get();
            StudyDto studyDto = StudyDto.of(studyEntity);

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

            if (studyRepository.findByStudyCode(studyCode).isEmpty()) // studyCode와 일치하는 결과가 없을 경우 예외처리(찾는 study가 없는 경우)
                throw new RestException(HttpStatus.NOT_FOUND, "Not found study");

            Study studyEntity = studyRepository.findByStudyCode(studyCode).get(); // 참가하려는 study 정보
            ConnStudy connStudyEntity = connStudyRepository.findByStudy_StudyIdAndRole(studyEntity.getStudyId(), "LEADER").get();
            User studyLeaderEntity = connStudyEntity.getUser(); // 참가하려는 스터디 스터디장 정보
            githubToken = tokenRepository.findByGithubId(studyLeaderEntity.getGithubId()).get().getGithubToken(); // 스터디장 깃토큰

            if(connStudyRepository.findByUser_UserIdAndStudy_StudyId(userId,studyEntity.getStudyId()).isPresent()) // userId, studyId와 일치하는 결과가 있을 경우 예외처리(이미 가입한 경우)
                throw new RestException(HttpStatus.BAD_REQUEST, "Already joined");

            String inviteUserRequest = "{\"role\":\"maintainer\"}";
            webClient.put()
                    .uri("/orgs/{org}/teams/{team_slug}/memberships/{username}",
                            "co-nnection",
                            studyLeaderEntity.getGithubId(),
                            userEntity.getGithubId())
                    .header(HttpHeaders.AUTHORIZATION,
                            "Bearer " + githubToken)
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
                    throw new RestException(HttpStatus.NOT_FOUND, "No study participated");

                connStudyEntity = connStudyRepository.findByUser_UserId(userId).get();
                studyLeaderEntity = userRepository.findById(connStudyRepository.findByStudy_StudyIdAndRole(connStudyEntity.getStudy().getStudyId(), "LEADER").get().getUser().getUserId()).get();
            } else { // 추방하는 경우
                if (userRepository.findById(quitUserId).isEmpty()) // quitUserId 일치하는 결과가 없을 경우 예외처리(추방하려는 사용자가 없는 경우)
                    throw new RestException(HttpStatus.NOT_FOUND, "Not found user to deport");

                quitUserEntity = userRepository.findById(quitUserId).get();

                if (connStudyRepository.findByUser_UserId(quitUserId).isEmpty()) // quitUserId 일치하는 결과가 없을 경우 예외처리(추방하려는 사용자가 참여중인 study가 없는 경우)
                    throw new RestException(HttpStatus.NOT_FOUND, "No study participated by user");

                connStudyEntity = connStudyRepository.findByUser_UserId(quitUserId).get();
                studyLeaderEntity = userRepository.findById(userId).get();
            }

            studyEntity = studyRepository.findById(connStudyEntity.getStudy().getStudyId()).get();

            if(connStudyRepository.findByUser_UserIdAndStudy_StudyId(quitUserEntity.getUserId(),studyEntity.getStudyId()).isEmpty()) // userId, studyId와 일치하는 결과가 없을 경우 예외처리(study의 스터디원이 아닌 경우)
                throw new RestException(HttpStatus.NOT_FOUND, "Already not a member");

            githubToken = tokenRepository.findByGithubId(studyLeaderEntity.getGithubId()).get().getGithubToken();

            webClient.delete()
                    .uri("/orgs/{org}/teams/{team_slug}/memberships/{username}",
                            "co-nnection",
                            studyEntity.getStudyRepository().substring(31),
                            quitUserEntity.getGithubId())
                    .header(HttpHeaders.AUTHORIZATION,
                            "Bearer " + githubToken)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();

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
            throw new RestException(HttpStatus.NOT_FOUND, "Not found study");

        githubToken = tokenRepository.findByGithubId(userEntity.getGithubId()).get().getGithubToken();

        webClient.delete()
                .uri("/orgs/{org}/teams/{team_slug}",
                        "co-nnection",
                        userEntity.getGithubId())
                .header(HttpHeaders.AUTHORIZATION,
                        "Bearer " + githubToken)
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
        List<ConnStudy> connStudyList = connStudyRepository.findAllByStudy_StudyId(connStudyEntity.getStudy().getStudyId()); // study에 참가한 스터디원 정보

        for (ConnStudy connStudy : connStudyList) {
            connStudyRepository.delete(connStudy);
        }
        studyRepository.delete(studyEntity);
    }
}