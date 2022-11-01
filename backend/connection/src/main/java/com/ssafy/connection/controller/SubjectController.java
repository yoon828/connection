package com.ssafy.connection.controller;

import com.ssafy.connection.dto.SubjectDto;
import com.ssafy.connection.entity.Problem;
import com.ssafy.connection.entity.Subject;
import com.ssafy.connection.entity.Tag;
import com.ssafy.connection.securityOauth.config.security.token.CurrentUser;
import com.ssafy.connection.securityOauth.config.security.token.UserPrincipal;
import com.ssafy.connection.service.ProblemService;
import com.ssafy.connection.service.SubjectService;
import com.ssafy.connection.service.TagService;
import io.swagger.annotations.ApiOperation;
import io.swagger.v3.oas.annotations.Parameter;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/subject")
public class SubjectController {

    private final ProblemService problemService;
    private final SubjectService subjectService;

    @Autowired
    public SubjectController(ProblemService problemService, SubjectService subjectService){
        this.problemService = problemService;
        this.subjectService = subjectService;
    }

    @ApiOperation(value = "문제제출")
    @PostMapping("/")
    public ResponseEntity makeSubject(@RequestBody SubjectDto subjectDto, @Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal){
        int result = 0;
        try{
            Long userId = userPrincipal.getId();
            result = subjectService.makeSubject(subjectDto, userId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @ApiOperation(value = "내 과제 현황", notes = "유저가 푼 과제 개수, 스터디문제(같이 푼) 개수와 전체 과제개수, 전체 스터디문제 개수를 반환")
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getTeamStatus(@Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal){
        List<Subject> totalSubjectList = subjectService.getTotalSubjectList(userPrincipal.getId());
        Map<String, Object> myMap = subjectService.getMyStatus(userPrincipal.getId(), totalSubjectList);

        return ResponseEntity.status(HttpStatus.OK).body(myMap);
    }
//    @ApiOperation(value = "내 과제 현황")
}
