package com.ssafy.connection.securityOauth.domain.entity.user;

import com.ssafy.connection.securityOauth.domain.entity.time.DefaultTime;
import lombok.Builder;
import lombok.Getter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Getter
@Table(name="token")
@Entity
public class Token extends DefaultTime {

    @Id
    @Column(name = "github_id", length = 1024 , nullable = false)
    private String githubId;

    @Column(name = "refresh_token", length = 1024 , nullable = false)
    private String refreshToken;

    public Token(){}

    public Token updateRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
        return this;
    }

    @Builder
    public Token(String githubId, String refreshToken) {
        this.githubId = githubId;
        this.refreshToken = refreshToken;
    }
}
