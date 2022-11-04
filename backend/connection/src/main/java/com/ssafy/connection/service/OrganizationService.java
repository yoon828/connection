package com.ssafy.connection.service;

import org.springframework.http.ResponseEntity;

public interface OrganizationService {
    void joinOrganization(long userId);

    ResponseEntity checkOrganization(long userId);
}