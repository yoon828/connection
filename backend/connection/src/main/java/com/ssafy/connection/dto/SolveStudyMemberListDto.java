package com.ssafy.connection.dto;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SolveStudyMemberListDto {
    private long userId;

    private String name;

    private String imageUrl;

    private List<SolveStudyMemberDto> series = new ArrayList<>();
}
