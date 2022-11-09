package com.ssafy.connection.controller;

import com.ssafy.connection.dto.ProblemReturnDto;
import com.ssafy.connection.dto.ResponseDto;
import com.ssafy.connection.securityOauth.config.security.token.CurrentUser;
import com.ssafy.connection.securityOauth.config.security.token.UserPrincipal;
import com.ssafy.connection.service.ProblemService;
import com.ssafy.connection.service.WorkbookService;
import io.swagger.annotations.*;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/workbook")
public class WorkbookController {
    private final ProblemService problemService;
    private final WorkbookService workbookService;

    @Autowired
    public WorkbookController(ProblemService problemService, WorkbookService workbookService){
        this.problemService = problemService;
        this.workbookService = workbookService;
    }

    @ApiOperation(value = "문제 추가", notes = "현재 유저가 속해있는 스터디의 문제집에 문제 추가")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "problemId", value = "추가할 문제 번호", required = true)
    })
    @ApiResponses({
            @ApiResponse(code = 200, message = "success : 성공"),
            @ApiResponse(code = 409, message = "already exist : 이미 문제집에 해당 문제가 있음<br>" +
                                                "wrong parameter value : 번호에 해당되는 문제가 DB에 없음")
    })
    @PostMapping("")
    public ResponseEntity<ResponseDto> addProblem(@RequestParam("problemId") Long problemId, @Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal){
        switch(workbookService.addProblem(problemId, userPrincipal.getId())){
            case 1:
                return ResponseEntity.status(HttpStatus.OK).body(new ResponseDto("success"));
            case 0:
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new ResponseDto("already exist"));
            case 2:
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new ResponseDto("wrong parameter value"));
            case -1:
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new ResponseDto("no study"));
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ResponseDto("fail"));
    }

    @ApiOperation(value = "문제 삭제", notes = "현재 유저가 속해있는 스터디의 문제집에서 문제 삭제")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "problemId", value = "삭제할 문제 번호", required = true)
    })
    @ApiResponses({
            @ApiResponse(code = 200, message = "success : 성공"),
            @ApiResponse(code = 409, message = "already delete : 문제집에 번호에 해당되는 문제가 없음<br>" +
                                                "wrong parameter value : 번호에 해당되는 문제가 DB에 없음")
    })
    @DeleteMapping("")
    public ResponseEntity<ResponseDto> deleteProblem(@RequestParam("problemId") Long problemId, @Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal){
        switch(workbookService.deleteProblem(problemId, userPrincipal.getId())){
            case 1:
                return ResponseEntity.status(HttpStatus.OK).body(new ResponseDto("success"));
            case 0:
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new ResponseDto("already delete"));
            case -2:
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new ResponseDto("wrong parameter value"));
            case -1 :
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new ResponseDto("no study"));
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ResponseDto("fail"));
    }

    @ApiOperation(value = "문제 조회", notes = "현재 유저가 속해있는 스터디의 문제집에서 문제 리스트 조회")
    @ApiResponses({
            @ApiResponse(code = 200, message = "success : 성공"),
            @ApiResponse(code = 409, message = "empty : 문제집에 문제가 없음")
    })
    @GetMapping("")
    public ResponseEntity<Map<String, Object>> getProblem(@Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal){
        Map<String, Object> returnMap = new HashMap<>();
        List<ProblemReturnDto> list = workbookService.getProblem(userPrincipal.getId());
        returnMap.put("data", list);
        if(list.size() > 0){
            returnMap.put("msg", "success");
            return ResponseEntity.status(HttpStatus.OK).body(returnMap);
        } else {
            returnMap.put("msg", "empty");
            return ResponseEntity.status(HttpStatus.OK).body(returnMap);
        }
    }

}
