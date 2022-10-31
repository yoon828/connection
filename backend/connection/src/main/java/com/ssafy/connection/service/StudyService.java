package com.ssafy.connection.service;

import com.ssafy.connection.dto.StudyDto;
import com.ssafy.connection.entity.Study;

public interface StudyService {
    void createStudy(long userId, StudyDto studyDto);

    StudyDto getStudy(String studyCode);

    void joinStudy(long userId,String studyCode);

    void quitStudy(long userId, Long quitUserId);

    void deleteStudy(long userId);

    int getStudyTier(Long userId);
}
