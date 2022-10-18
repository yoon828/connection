package com.ssafy.connection.dto;

import com.ssafy.connection.entity.Problem;
import com.ssafy.connection.entity.Study;
import com.ssafy.connection.util.ModelMapperUtils;

import javax.persistence.Column;

public class StudyDto {
    private long studyId;

    private String studyCode;

    private String studyName;

    public static StudyDto of(Study studyEntity) {
        StudyDto studyDto = ModelMapperUtils.getModelMapper().map(studyEntity, StudyDto.class);

        return studyDto;
    }
}
