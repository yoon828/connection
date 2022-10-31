package com.ssafy.connection.controller;

import com.ssafy.connection.dto.ProblemReturnDto;
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

import java.util.List;

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
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 400, message = "실패(이미 문제집에 해당 문제가 있음)"),
            @ApiResponse(code = 404, message = "실패(번호에 해당하는 문제가 없음)")
    })
    @PostMapping("/")
    public ResponseEntity<String> addProblem(@RequestParam("problemId") Long problemId, @Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal){
        switch(workbookService.addProblem(problemId, userPrincipal.getId())){
            case 1:
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("success");
            case 0:
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("already exist");
            case 2:
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("wrong problemId");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("fail");
    }

    @ApiOperation(value = "문제 삭제", notes = "현재 유저가 속해있는 스터디의 문제집에서 문제 삭제")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "problemId", value = "삭제할 문제 번호", required = true)
    })
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 400, message = "실패(번호에 해당하는 문제가 없음)"),
            @ApiResponse(code = 404, message = "실패(문제집에 해당 문제가 없음)")
    })
    @DeleteMapping("/")
    public ResponseEntity<String> deleteProblem(@RequestParam("problemId") Long problemId, @Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal){
        switch(workbookService.deleteProblem(problemId, userPrincipal.getId())){
            case 1:
                return ResponseEntity.status(HttpStatus.OK).body("success");
            case 0:
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("already deleted");
            case -1:
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("wrong problemId");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("fail");
    }

    @ApiOperation(value = "문제 조회", notes = "현재 유저가 속해있는 스터디의 문제집에서 문제 리스트 조회")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 404, message = "실패(문제집이 비었음)")
    })
    @GetMapping("/")
    public ResponseEntity<List<ProblemReturnDto>> getProblem(@Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal){
        List<ProblemReturnDto> list = workbookService.getProblem(userPrincipal.getId());
        if(list.size() > 0){
            return ResponseEntity.status(HttpStatus.OK).body(list);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(list);
        }
    }

}
