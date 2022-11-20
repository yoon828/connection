package com.ssafy.connection.securityOauth.config.security.handler;

import com.ssafy.connection.securityOauth.config.security.util.CustomCookie;
import com.ssafy.connection.securityOauth.repository.auth.CustomAuthorizationRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RequiredArgsConstructor
@Component
public class CustomSimpleUrlAuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler{
    private final CustomAuthorizationRequestRepository customAuthorizationRequestRepository;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        String targetUrl = CustomCookie.getCookie(request, CustomAuthorizationRequestRepository.REDIRECT_URI_PARAM_COOKIE_NAME)
                .map(Cookie::getValue)
                .orElse(("/"));

        System.out.println("\n\n\n");
        System.out.println("여기 로그인 실패 ~~~~~~~~~~~~");
        System.out.println(exception.getLocalizedMessage() + "*&^*$%^&$&%^*%^&%^&$%^$%*&%^&^%");
        System.out.println(exception.getMessage() + "메세지");
        System.out.println(exception.toString() + "투스트링");
        System.out.println("부가정보");
        System.out.println(request.getServerName());
        System.out.println(request.getRequestURI());
        System.out.println(request.getRequestURL());

        targetUrl = UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("error", exception.getLocalizedMessage())
                .build().toUriString();

        customAuthorizationRequestRepository.removeAuthorizationRequestCookies(request, response);

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
