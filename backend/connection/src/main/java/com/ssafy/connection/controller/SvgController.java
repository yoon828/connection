package com.ssafy.connection.controller;

import com.ssafy.connection.securityOauth.payload.response.Message;
import com.ssafy.connection.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//@Tag(name = "svg", description = "svg requesting API")
//@RequiredArgsConstructor
@RestController
@RequestMapping("/svg")
public class SvgController {
    private final SvgService svgService;

    public SvgController(SvgService svgService){
        this.svgService = svgService;
    }

    @Operation(summary = "과제현황", description = "과제현황 이미지")
    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "로그아웃 성공", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Message.class) ) } )
    })
    @GetMapping(value="/{studyName}")
    public ResponseEntity svgtest(@PathVariable("studyName") String studyName) {
        return svgService.getSubjectSvg(studyName);
    }
}
