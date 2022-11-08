package com.ssafy.connection.service;

import com.ssafy.connection.dto.GitPushDto;
import com.ssafy.connection.dto.SubjectDto;
import com.ssafy.connection.entity.Subject;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface SubjectService {
    ResponseEntity makeSubject(SubjectDto subjectDto, Long userId) throws IOException;
    ResponseEntity getTeamStatus(Long userId);
    Map<String, Object> getMyStatus(Long userId, List<Subject> totalSubjectList);
    List<Subject> getTotalSubjectList(Long userId);
    Map<String, Integer> getSubjectCountByMonth(List<Subject> totalSubjectList, List<User> userList);
    ResponseEntity submitSubject(GitPushDto gitPushDto) throws IOException;
    ResponseEntity updateProblemReadme(SubjectDto subjectDto, Long userId) throws IOException;
    ResponseEntity updateProblemReadme(GitPushDto gitPushDto) throws IOException;
}
