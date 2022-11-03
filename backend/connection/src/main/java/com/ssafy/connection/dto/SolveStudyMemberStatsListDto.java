package com.ssafy.connection.dto;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SolveStudyMemberStatsListDto {
    private String name;

    private List<SolveStudyMemberStatsDto> trackingDetails = new ArrayList<>();
}
