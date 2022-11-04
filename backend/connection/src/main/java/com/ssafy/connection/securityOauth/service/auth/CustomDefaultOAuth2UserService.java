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
//    private final String adminGithubToken = "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";
//    private WebClient webClient = WebClient.create("https://api.github.com");
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

            if(!user.isIsmember())organizationService.joinOrganization(user.getUserId());
        } else {
            user = registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
            organizationService.joinOrganization(user.getUserId());
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

        return userRepository.save(user);
    }

    private User updateExistingUser(User user, OAuth2UserInfo oAuth2UserInfo) {

        if(!oAuth2UserInfo.getName().isEmpty()) user.updateName(oAuth2UserInfo.getName());  //네임 있을때만 업뎃
        user.updateImageUrl(oAuth2UserInfo.getImageUrl());

        return userRepository.save(user);
    }
}
