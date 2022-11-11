package com.ssafy.connection.dto;

import com.ssafy.connection.entity.ConnStudy;
import com.ssafy.connection.util.ModelMapperUtils;

import java.time.LocalDateTime;

public class ConnStudyDto {
    private long connStudyId;

    private String role;

    private LocalDateTime joinedDate;

    public static ConnStudyDto of(ConnStudy connStudyEntity) {
        ConnStudyDto connStudyDto = ModelMapperUtils.getModelMapper().map(connStudyEntity, ConnStudyDto.class);

        return connStudyDto;
    }
}
