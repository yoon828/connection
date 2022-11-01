package com.ssafy.connection.controller;

import com.ssafy.connection.dto.ProblemReturnDto;
import com.ssafy.connection.securityOauth.config.security.token.CurrentUser;
import com.ssafy.connection.securityOauth.config.security.token.UserPrincipal;
import com.ssafy.connection.service.ProblemService;
import com.ssafy.connection.service.ReviewService;
import com.ssafy.connection.service.SolveService;
import com.ssafy.connection.service.TagService;
import io.swagger.annotations.*;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.*;

@RestController
@RequestMapping("/problem")
public class ProblemController {

    private final ProblemService problemService;
    private final TagService tagService;
    private final SolveService solveService;
    private final ReviewService reviewService;

    @Autowired
    public ProblemController(ProblemService problemService, TagService tagService, SolveService solveService,
                                ReviewService reviewService){
        this.problemService = problemService;
        this.tagService = tagService;
        this.solveService = solveService;
        this.reviewService = reviewService;
    }

    @ApiOperation(value = "문제 추천", notes = "체감 난이도 & 스터디원 중 몇명이 풀었는지 여부는 유저쪽 완료되면 완성")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "level", value = "난이도(티어) 설정", required = false),
            @ApiImplicitParam(name = "tag", value = "태그(문제 유형) 설정", required = false)
    })
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

    @ApiOperation(value = "문제 검색 (통합검색)", notes = "keyword를 입력받아 포함된 제목의 문제나 일치하는 번호의 문제를 반환")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 404, message = "검색된 문제 없음")
    })
    @ApiImplicitParams({
            @ApiImplicitParam(name = "keyword", value = "검색할 키워드", required = true)
    })
    @GetMapping("/search")
    public ResponseEntity<List<ProblemReturnDto>> searchProblem(@RequestParam(value = "keyword") String keyword,
                                                                    @Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal){
        try {
            keyword = URLDecoder.decode(keyword, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
        List<ProblemReturnDto> returnList = problemService.searchProblem(keyword, userPrincipal);
        if(returnList.size() > 0){
            return ResponseEntity.status(HttpStatus.OK).body(returnList);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(returnList);
        }
    }

    @ApiOperation(value = "문제 제출", notes = "problemId와 baekjoonId를 입력받아 풀이 여부를 저장")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 400, message = "해당 문제가 없음")
    })
    @PostMapping("/submit")
    public ResponseEntity<String> submitProblem(@RequestBody Map<String, Object> map){
        boolean result = solveService.saveSolve((String) map.get("problemId"), (String) map.get("baekjoonId"));
        if(result){
            return ResponseEntity.status(HttpStatus.OK).body("success");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("fail");
    }

    @ApiOperation(value = "문제 풀이 등록", notes = "유저 회원가입 시, 유저의 문제 풀이 목록을 저장")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "list", value = "유저가 푼 문제 리스트(1111, 2222, ....)", required = true)
    })
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공")
    })
    @PostMapping("/register")
    public ResponseEntity<String> saveSolve(@RequestBody Map<String, Object> map,
                                                @Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal){
        boolean result = solveService.saveSolveList((List<String>) map.get("list"), userPrincipal.getId());
        return ResponseEntity.status(HttpStatus.OK).body("success");
    }

    @ApiOperation(value = "문제 리뷰 등록", notes = "문제 스터디 완료 후, 문제에 대한 리뷰를 저장")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "list", value = "문제에 대한 리뷰", required = true)
    })
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 400, message = "실패(문제 ID 잘못됨)")
    })
    @PostMapping("/review")
    public ResponseEntity<String> saveReview(@RequestBody List<Map<String, Object>> list){
        int result = reviewService.saveReview(list);
        switch (result){
            case 1:
                return ResponseEntity.status(HttpStatus.OK).body("success");
            case -1:
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("wrong problemId");
        }
        return null;
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
//\
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
