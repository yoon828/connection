package com.ssafy.connection.securityOauth.config.security.token;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.connection.securityOauth.service.auth.CustomTokenProviderService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
public class CustomOncePerRequestFilter extends OncePerRequestFilter{

    @Autowired
    private CustomTokenProviderService customTokenProviderService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String jwt = getJwtFromRequest(request);

        try {
            if (StringUtils.hasText(jwt) && customTokenProviderService.validateToken(jwt)) {
                UsernamePasswordAuthenticationToken authentication = customTokenProviderService.getAuthenticationById(jwt);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        catch(ExpiredJwtException jwtException){
            System.out.println("토큰만료");

            ObjectMapper mapper = new ObjectMapper();

            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");

            ResponseStatusException responseStatusException = new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "토큰이 만료되었습니다.expiredtoken");


            mapper.writeValue(response.getWriter(), responseStatusException);
        }catch (JwtException | IllegalArgumentException exception) {
            log.info("jwtException : {}", exception);
            throw exception;
        }

        filterChain.doFilter(request, response);


    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer")) {
            log.info("bearerToken = {}", bearerToken.substring(7, bearerToken.length()));
            return bearerToken.substring(7, bearerToken.length());
        }
        return null;
    }
    
}
