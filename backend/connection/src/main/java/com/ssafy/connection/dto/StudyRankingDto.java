package com.ssafy.connection.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class StudyRankingDto {
    private String studyName;

    private long studyId;

    private int studyScore;

    private int homeworkScore;

    private int totalScore;

    private int ranking;

    private String studyRepository;
}
