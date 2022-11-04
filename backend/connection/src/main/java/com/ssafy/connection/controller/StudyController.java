package com.ssafy.connection.controller;

import com.ssafy.connection.dto.SolveStudyStatsDto;
import com.ssafy.connection.dto.SolveStudyStatsInterface;
import com.ssafy.connection.dto.StudyDto;
import com.ssafy.connection.entity.Study;
import com.ssafy.connection.entity.Subject;
import com.ssafy.connection.securityOauth.config.security.token.CurrentUser;
import com.ssafy.connection.securityOauth.config.security.token.UserPrincipal;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
import com.ssafy.connection.service.StudyService;
import com.ssafy.connection.service.SubjectService;
import io.swagger.annotations.*;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/study")
public class StudyController {

    private final StudyService studyService;
    private final SubjectService subjectService;

    @Autowired
    public StudyController(StudyService studyService, SubjectService subjectService) {
        this.studyService = studyService;
        this.subjectService = subjectService;
    }

    @ApiOperation(value = "스터디 Repository 생성", notes = "study_name을 입력받아 새로운 스터디 생성(Github team&repository)")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 400, message = "이미 다른 스터디에 가입되어 있음"),
            @ApiResponse(code = 409, message = "스터디명 중복")
    })
    @ApiImplicitParams({
            @ApiImplicitParam(name = "study_name", value = "생성할 스터디명", required = true)
    })
    @PostMapping
    public ResponseEntity<String> createStudy(@RequestParam(value = "study_name") String studyName, @Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal){
        long userId = userPrincipal.getId();
        studyService.createStudy(userId, studyName);

        return new ResponseEntity<String>("success",HttpStatus.OK);
    }

    @ApiOperation(value = "스터디 해체")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 400, message = "본인이 스터디장인 스터디가 없는 경우")
    })
    @DeleteMapping
    public ResponseEntity<String> deleteStudy(@Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal) {
        long userId = userPrincipal.getId();
        studyService.deleteStudy(userId);

        return new ResponseEntity<String>("success", HttpStatus.OK);
    }

    @ApiOperation(value = "스터디 조희", notes = "study_code를 입력받아 일치하는 스터디 조회")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 404, message = "스터디코드와 일치하는 스터디가 없는 경우")
    })
    @ApiImplicitParams({
            @ApiImplicitParam(name = "study_code", value = "스터디코드", required = true)
    })
    @GetMapping("/join/{study_code}")
    public ResponseEntity<StudyDto> getStudy(@PathVariable("study_code") String studyCode, @Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal){
        long userId = userPrincipal.getId();
        StudyDto studyDto = studyService.getStudy(userId, studyCode);

        return ResponseEntity.status(HttpStatus.OK).body(studyDto);
    }

    @ApiOperation(value = "스터디 참가", notes = "study_code를 입력받아 일치하는 스터디 참가")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 400, message = "이미 해당 스터디에 참가한 경우"),
            @ApiResponse(code = 404, message = "스터디코드와 일치하는 스터디가 없는 경우")
    })
    @ApiImplicitParams({
            @ApiImplicitParam(name = "study_code", value = "스터디코드", required = true)
    })
    @PostMapping("/join/{study_code}")
    public ResponseEntity<String> joinStudy(@PathVariable("study_code") String studyCode, @Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal) {
        long userId = userPrincipal.getId();
        studyService.joinStudy(userId, studyCode);

        return new ResponseEntity<String>("success", HttpStatus.OK);
    }

    @ApiOperation(value = "스터디 탈퇴 및 추방", notes = "user_id를 입력받아 스터디원을 추방하거나 본인이 스터디 탈퇴")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 400, message = "탈퇴 or 추방하려는 회원의 정보가 없거나 / 참여중인 스터디가 없거나 / 해당 스터디원이 아니거나 / (추방시킬 때) 스터디장이 아닌 경우 경우")
    })
    @ApiImplicitParams({
            @ApiImplicitParam(name = "user_id", value = "추방하려는 사용자id", required = false)
    })
    @DeleteMapping("/quit")
    public ResponseEntity<String> quitStudy(@RequestParam(value = "user_id", required = false) Long quitUserId, @Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal) {
        long userId = userPrincipal.getId();
        studyService.quitStudy(userId, quitUserId);

        return new ResponseEntity<String>("success", HttpStatus.OK);
    }

    @ApiOperation(value = "스터디 스트릭", notes = "사용자가 참가한 스터디의 스트릭 정보 반환")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공")
    })
    @GetMapping("streak")
    public ResponseEntity<Map<String, Object>> getStudyStreak(@Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal) {
        long userId = userPrincipal.getId();
        Map<String, Object> result = studyService.getStudyStreak(userId);

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @ApiOperation(value = "", notes = "")
    @GetMapping("ranking")
    public ResponseEntity<Map<String, Object>> getStudyRanking(@Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal) {
        long userId = userPrincipal.getId();
        Map<String, Object> result = studyService.getStudyRanking();

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @ApiOperation(value = "", notes = "")
    @GetMapping("member")
    public ResponseEntity<Map<String, Object>> getStudyMember(@Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal) {
        long userId = userPrincipal.getId();
        Map<String, Object> result = studyService.getStudyMember(userId);

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

}
