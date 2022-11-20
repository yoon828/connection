package com.ssafy.connection.controller;

import com.ssafy.connection.dto.ResponseDto;
import com.ssafy.connection.securityOauth.config.security.token.CurrentUser;
import com.ssafy.connection.securityOauth.config.security.token.UserPrincipal;
import com.ssafy.connection.service.OrganizationService;
import io.swagger.annotations.*;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/organization")
public class OrganizationController {

    private final OrganizationService organizationService;

    @Autowired
    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @ApiOperation(value = "Organization 초대", notes = "사용자를 깃허브 organization에 초대")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공")
    })
    @PostMapping
    public ResponseEntity<String> joinOrganization(@Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal) {
        long userId = userPrincipal.getId();
        organizationService.joinOrganization(userId);

        return new ResponseEntity<String>("success", HttpStatus.OK);
    }

    @ApiOperation(value = "Organization 동의 확인", notes = "사용자의 깃허브 organization 초대 동의 여부 확인")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 404, message = "동의하지 않은 경우")
    })
    @GetMapping
    public ResponseEntity<ResponseDto> checkOrganization(@Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal){
        long userId = userPrincipal.getId();
        return organizationService.checkOrganization(userId);
    }
}
