package com.ssafy.connection.service;

import com.ssafy.connection.dto.SolveStudyStatsDto;
import com.ssafy.connection.dto.SolveStudyStatsInterface;
import com.ssafy.connection.dto.StudyDto;
import com.ssafy.connection.securityOauth.domain.entity.user.User;

import java.util.List;
import java.util.Map;

public interface StudyService {
    void createStudy(long userId, String studyName);

    StudyDto getStudy(long userId, String studyCode);

    void joinStudy(long userId,String studyCode);

    void quitStudy(long userId, Long quitUserId);

    void deleteStudy(long userId);

    int getStudyTier(long userId);

    Map<String, Object> getStudyStreak(long userId);

    Map<String, Object> getStudyRanking();

    Map<String, Object> getStudyMember(long userId);

}
