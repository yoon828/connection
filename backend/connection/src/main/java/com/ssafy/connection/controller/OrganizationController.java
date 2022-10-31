package com.ssafy.connection.controller;

import com.ssafy.connection.securityOauth.config.security.token.CurrentUser;
import com.ssafy.connection.securityOauth.config.security.token.UserPrincipal;
import com.ssafy.connection.service.OrganizationService;
import io.swagger.annotations.ApiOperation;
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

    @ApiOperation(value = "Organization 초대")
    @PostMapping
    public ResponseEntity<String> joinOrganization(@Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal) {
        long userId = userPrincipal.getId();
        organizationService.joinOrganization(userId);

        return new ResponseEntity<String>("success", HttpStatus.OK);
    }

    @ApiOperation(value = "Organization 동의 확인")
    @GetMapping
    public ResponseEntity<String> checkOrganization(@Parameter(description = "Accesstoken", required = true) @CurrentUser UserPrincipal userPrincipal){
        long userId = userPrincipal.getId();
        organizationService.checkOrganization(userId);

        return ResponseEntity.status(HttpStatus.OK).body("");
    }
}
