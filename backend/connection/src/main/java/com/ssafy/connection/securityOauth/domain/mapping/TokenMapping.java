package com.ssafy.connection.securityOauth.domain.mapping;

import lombok.Builder;
import lombok.Data;

@Data
public class TokenMapping {
    private String githubId;
    private String accessToken;
    private String refreshToken;

    public TokenMapping(){}

    @Builder
    public TokenMapping(String githubId, String accessToken, String refreshToken){
        this.githubId = githubId;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

}
