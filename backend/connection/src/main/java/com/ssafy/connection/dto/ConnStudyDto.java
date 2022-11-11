package com.ssafy.connection.dto;

import com.ssafy.connection.entity.ConnStudy;
import com.ssafy.connection.util.ModelMapperUtils;

public class ConnStudyDto {
    private long connStudyId;

    private String role;

    private int studyScore;

    private int subjectScore;

    private int bonusScore;

    public static ConnStudyDto of(ConnStudy connStudyEntity) {
        ConnStudyDto connStudyDto = ModelMapperUtils.getModelMapper().map(connStudyEntity, ConnStudyDto.class);

        return connStudyDto;
    }
}
