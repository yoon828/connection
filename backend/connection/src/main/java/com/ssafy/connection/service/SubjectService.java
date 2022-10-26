package com.ssafy.connection.service;

import com.ssafy.connection.dto.SubjectDto;
import com.ssafy.connection.entity.Subject;

public interface SubjectService {
    int makeSubject(SubjectDto subjectDto, Long userId);
    void getTeamStatus(Long studyId, Long userId);
}
