package com.ssafy.connection.dto;

import com.ssafy.connection.entity.Problem;
import com.ssafy.connection.entity.Subject;
import com.ssafy.connection.util.ModelMapperUtils;

import java.time.LocalDateTime;

public class SubjectDto {
    private long subjectId;

    private LocalDateTime deadline; // 제출 기한

    public static SubjectDto of(Subject subjectEntity) {
        SubjectDto subjectDto = ModelMapperUtils.getModelMapper().map(subjectEntity, SubjectDto.class);

        return subjectDto;
    }
}
