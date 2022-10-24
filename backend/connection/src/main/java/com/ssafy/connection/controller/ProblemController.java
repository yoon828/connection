package com.ssafy.connection.controller;

import com.ssafy.connection.dto.ProblemReturnDto;
import com.ssafy.connection.service.ProblemService;
import com.ssafy.connection.service.SolveService;
import com.ssafy.connection.service.TagService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public void loadJsonFromApi(){
        problemService.loadAllProblemFromApi();
    }
}
