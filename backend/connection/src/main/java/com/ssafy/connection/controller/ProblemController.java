package com.ssafy.connection.controller;

import com.ssafy.connection.dto.ProblemReturnDto;
import com.ssafy.connection.entity.Problem;
import com.ssafy.connection.entity.Tag;
import com.ssafy.connection.service.ProblemService;
import com.ssafy.connection.service.SolveService;
import com.ssafy.connection.service.TagService;
import io.swagger.annotations.ApiOperation;
import org.json.simple.*;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.net.*;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/problem")
public class ProblemController {

    private final ProblemService problemService;
    private final TagService tagService;
    private final SolveService solveService;

    @Autowired
    public ProblemController(ProblemService problemService, TagService tagService, SolveService solveService){
        this.problemService = problemService;
        this.tagService = tagService;
        this.solveService = solveService;
    }

    @ApiOperation(value = "문제 추천 (임시 로직 적용)")
    @GetMapping("/recommend")
    public ResponseEntity<Map<String, Object>> getRecommendProblemList(@RequestParam(value = "level", required = false) Long level,
                                                                       @RequestParam(value = "tag", required = false) String tag) {
        Map<String, Object> returnMap = new HashMap<>();

        if(level == null && !(tag == null || tag.isEmpty())) {  // tag만 입력되었을 경우
            returnMap.put("popular", problemService.getPopularProblemList(tag));
        } else if(level != null && (tag == null || tag.isEmpty())){ // level만 입력되었을 경우
            returnMap.put("popular", problemService.getPopularProblemList(level));
        } else if(level != null && !(tag == null || tag.isEmpty())){    // tag, level 모두 입력되었을 경우
            returnMap.put("popular", problemService.getPopularProblemList(level, tag));
        } else {    // 아무값도 입력되지 않았을 경우
            returnMap.put("popular", problemService.getPopularProblemList());
        }
        if(tag == null || tag.isEmpty()) {
            System.out.println("tag is null");
        }
//        returnMap.put("workbook", problemService.getWorkBookProblemList(level, tag));
        return ResponseEntity.status(HttpStatus.OK).body(returnMap);
    }

    @ApiOperation(value = "유저가 푼 문제 반환 (테스트용)")
    @GetMapping("/test")
    public ResponseEntity<List<ProblemReturnDto>> getSolvedProblemList(@RequestParam("baekjoonId") String baekjoonId){
        List<ProblemReturnDto> returnList = problemService.getSolvedProblemList(baekjoonId);
        return ResponseEntity.status(HttpStatus.OK).body(returnList);
    }

    @ApiOperation(value = "문제에 대한 데이터와 풀이 여부 반환")
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getProblem(@RequestParam("problemId") long problemId, @RequestParam("userId") long userId){
        Map<String, Object> returnMap = new HashMap<>();
        returnMap.put("problem", problemService.getProblem(problemId));
        returnMap.put("isSolved", solveService.isSolved(problemId, userId));
        return ResponseEntity.status(HttpStatus.OK).body(returnMap);
    }

    @ApiOperation(value = "백준 전체 문제 데이터 반환(사용 안함)")
    @GetMapping("/all")
    public ResponseEntity<List<ProblemReturnDto>> getProblemList(){
        List<ProblemReturnDto> returnList = problemService.getProblemList();
        return ResponseEntity.status(HttpStatus.OK).body(returnList);
    }

    @ApiOperation(value = "백준 전체 문제 DB에 저장(호출 금지)")
    @GetMapping("/api/load")
    public void loadAllProblemFromApi(){
        problemService.loadAllProblemFromApi();
    }
}
