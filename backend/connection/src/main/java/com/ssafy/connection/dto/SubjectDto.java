package com.ssafy.connection.dto;

import com.ssafy.connection.entity.Subject;
import com.ssafy.connection.util.ModelMapperUtils;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SubjectDto {
    private long subjectId;
    private LocalDateTime deadline; // 제출 기한
    private List<Long> problemList;
    private long studyId;


    public static SubjectDto of(Subject subjectEntity) {
        SubjectDto subjectDto = ModelMapperUtils.getModelMapper().map(subjectEntity, SubjectDto.class);

        return subjectDto;
    }
}
