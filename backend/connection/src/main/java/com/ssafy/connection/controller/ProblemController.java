package com.ssafy.connection.controller;

import com.ssafy.connection.dto.ProblemReturnDto;
import com.ssafy.connection.securityOauth.config.security.token.CurrentUser;
import com.ssafy.connection.securityOauth.config.security.token.UserPrincipal;
import com.ssafy.connection.service.ProblemService;
import com.ssafy.connection.service.SolveService;
import com.ssafy.connection.service.TagService;
import io.swagger.annotations.ApiOperation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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

    @ApiOperation(value = "문제 추천, 체감 난이도 & 스터디원 중 몇명이 풀었는지 여부는 유저쪽 완료되면 완성")
    @GetMapping("/recommend")
    public ResponseEntity<Map<String, Object>> getRecommendProblemList(@RequestParam(value = "level", required = false) Long level, @RequestParam(value = "tag", required = false) String tag) {
        Map<String, Object> returnMap = new HashMap<>();

        // 유저가 많이 푼 문제 추천
        if(level == null && !(tag == null || tag.isEmpty())) {          // tag만 입력되었을 경우
            returnMap.put("popular", problemService.getPopularProblemList(tag));
        } else if(level != null && (tag == null || tag.isEmpty())){     // level만 입력되었을 경우
            returnMap.put("popular", problemService.getPopularProblemList(level));
        } else if(level != null && !(tag == null || tag.isEmpty())){    // tag, level 모두 입력되었을 경우
            returnMap.put("popular", problemService.getPopularProblemList(level, tag));
        } else {                                                        // 아무값도 입력되지 않았을 경우
            returnMap.put("popular", problemService.getPopularProblemList());
        }

        // 스터디 문제집에 많이 담긴 문제 추천
        returnMap.put("workbook", problemService.getWorkBookProblemList());
        return ResponseEntity.status(HttpStatus.OK).body(returnMap);
    }

    @ApiOperation(value = "문제 검색 (통합검색)")
    @GetMapping("/search")
    public ResponseEntity<List<ProblemReturnDto>> searchProblem(@RequestParam(value = "keyword") String keyword,
                                                                    @Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal){
        List<ProblemReturnDto> returnList = problemService.searchProblem(keyword, userPrincipal);
        if(returnList.size() > 0){
            return ResponseEntity.status(HttpStatus.OK).body(returnList);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(returnList);
        }
    }

    @ApiOperation(value = "문제 제출")
    @GetMapping("/submit")
    public ResponseEntity<String> submitProblem(@RequestParam(value = "problemId") Long problemId,
                                                    @Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal){
        boolean result = solveService.saveSolve(problemId, userPrincipal.getId());
        if(result){
            return ResponseEntity.status(HttpStatus.OK).body("success");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("fail ");
    }

//    @ApiOperation(value = "유저가 푼 문제 반환 (테스트용)")
//    @GetMapping("/test")
//    public ResponseEntity<List<ProblemReturnDto>> getSolvedProblemList(@RequestParam("baekjoonId") String baekjoonId){
//        return ResponseEntity.status(HttpStatus.OK).body(problemService.getSolvedProblemList(baekjoonId));
//    }
//
//    @ApiOperation(value = "백준 전체 문제 데이터 반환(사용 안함)")
//    @GetMapping("/all")
//    public ResponseEntity<List<ProblemReturnDto>> getProblemList(){
//        return ResponseEntity.status(HttpStatus.OK).body(problemService.getProblemList());
//    }
//
//    @ApiOperation(value = "백준 전체 문제 DB에 저장(호출 금지)")
//    @GetMapping("/api/load")
//    public void loadAllProblemFromApi(){
//        problemService.loadAllProblemFromApi();
//    }

    //    @ApiOperation(value = "문제 검색 (제목은 포함, 문제번호는 일치)")
//    @GetMapping("/")
//    public ResponseEntity<List<ProblemReturnDto>> getProblem(@RequestParam(value = "problemId", required = false) Long problemId, @RequestParam(value = "title", required = false) String title){
//        List<ProblemReturnDto> returnList = new ArrayList<>();
//        if(problemId == null && !(title == null || title.isEmpty())) {      // title이 입력되었을 경우
//            returnList = problemService.getProblem(title);
//        } else if(problemId != null && (title == null || title.isEmpty())){ // problemId가 입력되었을 경우
//            returnList = problemService.getProblem(problemId);
//        } else {                                                            // 아무값도 입력되지 않았을 경우
//            returnList = problemService.getProblemList();
//        }
//
//        return ResponseEntity.status(HttpStatus.OK).body(returnList);
//    }
}
