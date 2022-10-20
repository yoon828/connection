package com.ssafy.connection.service;

import com.ssafy.connection.dto.SubjectDto;
import com.ssafy.connection.entity.Subject;

public interface SubjectService {
    void makeSubject(SubjectDto subjectDto, Long userId);
    void getTeamStatus(Long studyId, Long userId);
}
