package com.ssafy.connection.controller;

import com.ssafy.connection.dto.StudyDto;
import com.ssafy.connection.securityOauth.config.security.token.CurrentUser;
import com.ssafy.connection.securityOauth.config.security.token.UserPrincipal;
import com.ssafy.connection.service.StudyService;
import io.swagger.annotations.ApiOperation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/study")
public class StudyController {

    private final StudyService studyService;

    @Autowired
    public StudyController(StudyService studyService) {
        this.studyService = studyService;
    }

    @ApiOperation(value = "스터디 Repository 생성")
    @PostMapping
    public ResponseEntity<String> createStudy(@RequestBody StudyDto studyDto, @Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal){
        long userId = userPrincipal.getId();
        studyService.createStudy(userId, studyDto);

        return new ResponseEntity<String>("success",HttpStatus.OK);
    }

    @ApiOperation(value = "스터디 조희")
    @GetMapping("/join/{study_code}")
    public ResponseEntity<StudyDto> getStudy(@PathVariable("study_code") String studyCode){
        StudyDto studyDto = studyService.getStudy(studyCode);

        return ResponseEntity.status(HttpStatus.OK).body(studyDto);
    }

    @ApiOperation(value = "스터디 참가")
    @PostMapping("/join/{study_code}")
    public ResponseEntity<String> joinStudy(@PathVariable("study_code") String studyCode, @Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal) {
        long userId = userPrincipal.getId();
        studyService.joinStudy(userId, studyCode);
        return new ResponseEntity<String>("success", HttpStatus.OK);
    }
}
