package com.ssafy.connection.service;

import com.ssafy.connection.advice.RestException;
import com.ssafy.connection.dto.GithubUserDto;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import com.ssafy.connection.securityOauth.repository.user.UserRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

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
                    .uri("/orgs/{org}/invitations", "co-nnection")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminGithubToken)
                    .bodyValue(inviteUserRequest)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void checkOrganization(long userId) {
        User userEntity = userRepository.findById(userId).get(); // 로그인 한 사용자 정보

        webClient.get()
                .uri("/orgs/{org}/members/{username}","co-nnection",userEntity.getGithubId())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminGithubToken)
                .exchangeToMono(response -> {
                    if (response.statusCode().equals(HttpStatus.NO_CONTENT)) {
                        throw new RestException(HttpStatus.OK, "Organization join completed");
                    }
                    else {
                        throw new RestException(HttpStatus.NOT_FOUND, "Organization join incomplete");
                    }})
                .block();
    }
}
