package com.ssafy.connection.service;

import com.ssafy.connection.dto.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface StudyService {
    StudyInfoReturnDto createStudy(long userId, String studyName);

    StudyDto getStudy(long userId, String studyCode);

    void joinStudy(long userId,String studyCode);

    void quitStudy(long userId, Long quitUserId);

    void deleteStudy(long userId);

    int getStudyTier(long userId);

    Map<String, Object> getStudyStreak(long userId);

    Map<String, Object> getStudyRanking();

    List<SolveStudyMemberListDto> getStudyMember(long userId);

    void ckeckStudy(long userId, String studyName);

    ResponseEntity updateStudyReadme(StudyReadmeDto studyReadmeDto);

    ResponseEntity getStudyMemberList(Long userId);
}
