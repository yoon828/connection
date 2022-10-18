package com.ssafy.connection.dto;

import com.ssafy.connection.entity.ConnStudy;
import com.ssafy.connection.entity.Problem;
import com.ssafy.connection.util.ModelMapperUtils;

public class ConnStudyDto {
    private long connStudyId;

    public static ConnStudyDto of(ConnStudy connStudyEntity) {
        ConnStudyDto connStudyDto = ModelMapperUtils.getModelMapper().map(connStudyEntity, ConnStudyDto.class);

        return connStudyDto;
    }
}
