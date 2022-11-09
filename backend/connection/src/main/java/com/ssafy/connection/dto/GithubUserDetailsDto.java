package com.ssafy.connection.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class GithubUserDetailsDto {

    private String login;

    private long id;

    private String avatar_url;
}
