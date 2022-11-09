package com.ssafy.connection.securityOauth.service.auth;

import com.ssafy.connection.dto.GithubUserDto;
import com.ssafy.connection.securityOauth.advice.assertThat.DefaultAssert;
import com.ssafy.connection.securityOauth.config.security.auth.OAuth2UserInfo;
import com.ssafy.connection.securityOauth.config.security.auth.OAuth2UserInfoFactory;
import com.ssafy.connection.securityOauth.config.security.token.UserPrincipal;
import com.ssafy.connection.securityOauth.domain.entity.user.Provider;
import com.ssafy.connection.securityOauth.domain.entity.user.Role;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import com.ssafy.connection.securityOauth.repository.user.UserRepository;
import com.ssafy.connection.service.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class CustomDefaultOAuth2UserService extends DefaultOAuth2UserService{
    private WebClient webClient = WebClient.create("https://api.github.com");
    private final UserRepository userRepository;
    private final OrganizationService organizationService;
    
    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);
        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (Exception e) {
            DefaultAssert.isAuthentication(e.getMessage());
        }
        return null;
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(oAuth2UserRequest.getClientRegistration().getRegistrationId(), oAuth2User.getAttributes());
        DefaultAssert.isAuthentication(!oAuth2UserInfo.getId().isEmpty());

        Optional<User> userOptional = userRepository.findByGithubId(oAuth2UserInfo.getId());
        User user;
        if(userOptional.isPresent()) {
            user = userOptional.get();
            DefaultAssert.isAuthentication(user.getProvider().equals(Provider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId())));
            user = updateExistingUser(user, oAuth2UserInfo);

//            멤버여부 동기화 이제 필요없음 웹훅덕분에
//            if(!user.isIsmember()){
//                ResponseEntity responseEntity = organizationService.checkOrganization(user.getUserId());
//                if(!responseEntity.getStatusCode().equals(HttpStatus.OK))
//                    organizationService.joinOrganization(user.getUserId());
//            }

        } else {
            user = registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
            System.out.println("레지스터유저");

            String githubId = user.getGithubId();

            System.out.println("깃헙아이디" + githubId);
            System.out.println(user.getImageUrl());
            System.out.println("ㅇ");
            if(user.getImageUrl().equals(null)) { // Github image_url이 null인 경우
                System.out.println("이프문");
                GithubUserDto githubUserDto = webClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .path(String.format("/search/users"))
                                .queryParam("q", "user:"+githubId)
                                .build())
                        .retrieve()
                        .bodyToMono(GithubUserDto.class)
                        .block();
                System.out.println("잘가져왔음");
                System.out.println(githubUserDto.getItems().get(0).getAvatar_url());
                user.setImageUrl(githubUserDto.getItems().get(0).getAvatar_url());
                System.out.println("세터햇음");
                userRepository.save(user);
                System.out.println("유저저장");
            }
            System.out.println("이프문아래");
            organizationService.joinOrganization(user.getUserId());
            System.out.println("조인");
        }

        //깃허브 토큰 저장
        Map<String,Object> map = new HashMap<>();
        oAuth2User.getAttributes().forEach((key, value) -> {
            map.put(key,value);
        });
        String token = oAuth2UserRequest.getAccessToken().getTokenValue();
        map.put("githubtoken",token);


        return UserPrincipal.create(user, map);
    }

    private User registerNewUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfo oAuth2UserInfo) {
        User user = User.builder()
                    .provider(Provider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()))
                    .providerId(oAuth2UserInfo.getId()) //.name(oAuth2UserInfo.getName())
                    .name((oAuth2UserInfo.getName() == null) ? oAuth2UserInfo.getId() : oAuth2UserInfo.getName()) //비면 유저 인포
                    .email(oAuth2UserInfo.getEmail())
                    .imageUrl(oAuth2UserInfo.getImageUrl())
                    .githubId(oAuth2UserInfo.getId())
                    .role(Role.USER)
                    .build();

        // if(user.getImageUrl().isEmpty()) { // Github image_url이 null인 경우
        //     try{
        //         GithubUserDto githubUserDto = webClient.get()
        //                 .uri(uriBuilder -> uriBuilder
        //                         .path(String.format("/search/users"))
        //                         .queryParam("q", "user:"+user.getGithubId())
        //                         .build())
        //                 .retrieve()
        //                 .bodyToMono(GithubUserDto.class)
        //                 .block();

        //         user.setImageUrl(githubUserDto.getItems().get(0).getAvatar_url());
        //     }
        //     catch(Exception e) {
        //         user.setImageUrl("https://avatars.githubusercontent.com/u/116149938");
        //     }
        // }

        return userRepository.save(user);
    }

    private User updateExistingUser(User user, OAuth2UserInfo oAuth2UserInfo) {

        if(!oAuth2UserInfo.getName().isEmpty()) user.updateName(oAuth2UserInfo.getName());  //네임 있을때만 업뎃
        user.updateImageUrl(oAuth2UserInfo.getImageUrl());

        return userRepository.save(user);
    }
}
