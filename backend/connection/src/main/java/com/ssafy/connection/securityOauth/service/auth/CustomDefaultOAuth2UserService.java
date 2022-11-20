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
            System.out.println("loaduser 발견" + e.getCause().toString() + "이거랑" + e.toString());
            DefaultAssert.isAuthentication(e.getMessage());
        }
        return null;
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        //깃허브 토큰 저장
        Map<String,Object> map = new HashMap<>();
        oAuth2User.getAttributes().forEach((key, value) -> {
            map.put(key,value);
        });
        String token = oAuth2UserRequest.getAccessToken().getTokenValue();
        map.put("githubtoken",token);

        if(map.get("name") == null) map.put("name", map.get("login"));



        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(oAuth2UserRequest.getClientRegistration().getRegistrationId(), map);
//        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(oAuth2UserRequest.getClientRegistration().getRegistrationId(), oAuth2User.getAttributes());

//        System.out.println("프로세스 오어스 시작 ==================");
//        System.out.println(oAuth2UserRequest.getAccessToken().getTokenValue() + "유저리퀘스트 토큰밸류");
//        System.out.println(oAuth2UserRequest.getClientRegistration().toString() + "유저리퀘스트 클라이언트레지스트레시엿ㄴ");
//        System.out.println("유저리퀘스트어디셔널 파라미터 시작====");
//        oAuth2UserRequest.getAdditionalParameters().forEach((key, value) -> {
//            System.out.println(key + " : " + value);
//        });
//        System.out.println("파라미터끝");
//        System.out.println("오어스투 유저");
//        System.out.println("오어스투유저의 겟어트리뷰트");
//        oAuth2User.getAttributes().forEach((key, value) -> {
//            System.out.println(key + " : " + value);
//        });
//        System.out.println(oAuth2User.getName() + "오어스튜윺저 네임");
//
//        System.out.println("유저인포~~~");
//        oAuth2UserInfo.getAttributes().forEach((key, value) -> {
//            System.out.println(key + " : " + value);
//        });
//        System.out.println("프로세스 오어스발견");
//
//        if(!oAuth2UserInfo.getAttributes().isEmpty()){
//            if(oAuth2UserInfo.getAttributes().containsKey("id")){
//                if(oAuth2UserInfo.getAttributes().get("id") == ""){
//                    System.out.println("여기다111!!!!");
//                    DefaultAssert.isAuthentication(!oAuth2UserInfo.getId().isEmpty());
//                }
//            }
//            else {
//                System.out.println("여기다222!!!!");
//                DefaultAssert.isAuthentication(!oAuth2UserInfo.getId().isEmpty());
//            }
//        }
//        else {
//            System.out.println("여기다333!!!!");
//        }

        DefaultAssert.isAuthentication(!oAuth2UserInfo.getId().isEmpty());

        Optional<User> userOptional = userRepository.findByGithubId(oAuth2UserInfo.getId());
        User user;
        if(userOptional.isPresent()) {
            user = userOptional.get();
            System.out.println("프로세스 오어스발견두번쨰!");
            DefaultAssert.isAuthentication(user.getProvider().equals(Provider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId())));
            user = updateExistingUser(user, oAuth2UserInfo);
        } else {
            user = registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
            try {
                organizationService.joinOrganization(user.getUserId());
            }
            catch (Exception e){    //여기는 이미 멤버이거나 초대된경우 핸들링
                System.out.println("초대오류" + e);
            }
        }


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
