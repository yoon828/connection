package com.ssafy.connection.service;

import com.ssafy.connection.advice.RestException;
import com.ssafy.connection.dto.GithubUserDto;
import com.ssafy.connection.dto.ResponseDto;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import com.ssafy.connection.securityOauth.repository.user.UserRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
public class OrganizationServiceImpl implements OrganizationService{

    private final String adminGithubToken = "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";
    private WebClient webClient = WebClient.create("https://api.github.com");

    private final UserRepository userRepository;

    public OrganizationServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void joinOrganization(long userId) {
        try {
            User userEntity = userRepository.findById(userId).get(); // 로그인 한 사용자 정보

            GithubUserDto githubUserDto = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path(String.format("/search/users"))
                            .queryParam("q", "user:"+userEntity.getGithubId())
                            .build())
                    .retrieve()
                    .bodyToMono(GithubUserDto.class)
                    .block();

            String inviteUserRequest = "{\"invitee_id\": " + githubUserDto.getItems().get(0).getId() + "," +
                    "\"role\":\"direct_member\"," +
                    "\"team_ids\":[]}";
            webClient.post()
                    .uri("/orgs/{org}/invitations", "connection-official")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminGithubToken)
                    .bodyValue(inviteUserRequest)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();
        } catch (Exception e) {
            System.out.println("오가니제이션 초대"+e);
            throw new RuntimeException(e);
        }
    }
    @Override
    @Transactional
    public ResponseEntity checkOrganization(long userId) {
        User userEntity = userRepository.findById(userId).get(); // 로그인 한 사용자 정보

        try {
            webClient.get()
                    .uri("/orgs/{org}/members/{username}", "connection-official", userEntity.getGithubId())
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminGithubToken)
                    .retrieve()
                    .bodyToMono(void.class)
                    .block()
                    ;
        }
        catch (WebClientResponseException e){
            System.out.println(e);
            if(e.getStatusCode()== HttpStatus.NOT_FOUND) return new ResponseEntity(new ResponseDto("fail"),HttpStatus.CONFLICT);
        }

        User user = new User();
        user.setUserId(userEntity.getUserId());
        user.setName(userEntity.getName());
        user.setGithubId(userEntity.getGithubId());
        user.setBackjoonId(userEntity.getBackjoonId());
        user.setEmail(userEntity.getEmail());
        user.setImageUrl(userEntity.getImageUrl());
        user.setTier(userEntity.getTier());
        user.setIsmember(true);
        user.setPassword(userEntity.getPassword());
        user.setProvider(userEntity.getProvider());
        user.setRole(userEntity.getRole());
        user.setConnStudy(userEntity.getConnStudy());
        user.setSolve(userEntity.getSolve());

        try {
            userRepository.save(user);
        }catch (Exception e) {return new ResponseEntity(new ResponseDto("empty"),HttpStatus.CONFLICT);}

        return new ResponseEntity(new ResponseDto("success"),HttpStatus.OK);
    }
}
