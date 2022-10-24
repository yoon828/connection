package com.ssafy.connection.controller;

import com.ssafy.connection.dto.SubjectDto;
import com.ssafy.connection.entity.Problem;
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
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
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
    public void makeSubject(@RequestBody SubjectDto subjectDto, @Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal){
        try{
            Long userId = userPrincipal.getId();
            subjectService.makeSubject(subjectDto, userId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @ApiOperation(value = "진행중인 과제현황")
    @GetMapping("/{study_id}")
    public void getTeamStatus(@PathVariable("study_id") Long studyId, @Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal){
        try{
            Long userId = userPrincipal.getId();
            subjectService.getTeamStatus(studyId, userId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
//    @ApiOperation(value = "내 과제 현황")
}
