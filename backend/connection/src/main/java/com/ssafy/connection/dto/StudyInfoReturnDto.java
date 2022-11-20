package com.ssafy.connection.dto;

import com.ssafy.connection.entity.Study;
import com.ssafy.connection.util.ModelMapperUtils;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class StudyInfoReturnDto {
    private long studyId;

    private String studyCode;

    private String studyName;

    private String studyRepository;

    public static StudyInfoReturnDto of(Study studyEntity) {
        StudyInfoReturnDto studyInfoReturnDto = ModelMapperUtils.getModelMapper().map(studyEntity, StudyInfoReturnDto.class);

        return studyInfoReturnDto;
    }
}
