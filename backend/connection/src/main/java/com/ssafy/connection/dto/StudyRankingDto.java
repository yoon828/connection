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

    private String studyRepository;

    private int studyScore;

    private int subjectScore;

    private int bonusScore;

    private int totalScore;

    private int ranking;
}
