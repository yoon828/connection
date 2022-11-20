package com.ssafy.connection.dto;

import com.ssafy.connection.entity.Study;
import com.ssafy.connection.util.ModelMapperUtils;
import lombok.*;

import javax.persistence.Column;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class StudyDto {
    private long studyId;

    private String studyCode;

    private String studyName;

    private String studyRepository;

    private int studyPersonnel;

    private String studyLeaderName;

    public static StudyDto of(Study studyEntity) {
        StudyDto studyDto = ModelMapperUtils.getModelMapper().map(studyEntity, StudyDto.class);

        return studyDto;
    }
}
