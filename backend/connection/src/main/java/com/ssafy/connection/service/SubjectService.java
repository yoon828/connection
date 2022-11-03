package com.ssafy.connection.service;

import com.ssafy.connection.dto.SubjectDto;
import com.ssafy.connection.entity.Subject;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface SubjectService {
    ResponseEntity makeSubject(SubjectDto subjectDto, Long userId);
    ResponseEntity getTeamStatus(Long userId);
    Map<String, Object> getMyStatus(Long userId, List<Subject> totalSubjectList);

    List<Subject> getTotalSubjectList(Long userId);
}
