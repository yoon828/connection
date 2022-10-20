package com.ssafy.connection.controller;

import com.ssafy.connection.dto.ProblemDto;
import com.ssafy.connection.dto.ProblemTagDto;
import com.ssafy.connection.entity.Problem;
import com.ssafy.connection.entity.Tag;
import com.ssafy.connection.service.ProblemService;
import com.ssafy.connection.service.TagService;
import io.swagger.annotations.ApiOperation;
import org.json.simple.*;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/problem")
public class ProblemController {

    private final ProblemService problemService;
    private final TagService tagService;

    @Autowired
    public ProblemController(ProblemService problemService, TagService tagService){
        this.problemService = problemService;
        this.tagService = tagService;
    }

    @ApiOperation(value = "백준 전체 문제 데이터 반환")
    @GetMapping("/all")
    public ResponseEntity<List<ProblemTagDto>> getProblemList(){
        List<ProblemTagDto> returnList = problemService.getProblemList();
        return ResponseEntity.status(HttpStatus.OK).body(returnList);
    }

    @ApiOperation(value = "백준 전체 문제 DB에 저장(호출 금지)")
    @GetMapping("/api/load")
    public void loadJsonFromApi(){
        problemService.loadAllProblemFromApi();
    }
}
