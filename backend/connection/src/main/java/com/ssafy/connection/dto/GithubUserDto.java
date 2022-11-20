package com.ssafy.connection.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Getter
@Setter
public class GithubUserDto {

    private long total_count;

    private List<GithubUserDetailsDto> items = new ArrayList<>();
}

