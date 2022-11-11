package com.ssafy.connection.dto;

public interface StudyRankingInterface {
    String getStudyName();
    long getStudyId();
    String getStudyRepository();
    int getStudyScore();
    int getSubjectScore();
    int getBonusScore();
    int getTotalScore();
}
