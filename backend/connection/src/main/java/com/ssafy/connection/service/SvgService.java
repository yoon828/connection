package com.ssafy.connection.service;

import org.springframework.http.ResponseEntity;

public interface SvgService {
    ResponseEntity getSubjectSvg(String studyName);
}
