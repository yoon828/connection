package com.ssafy.connection.dto;

import com.ssafy.connection.entity.Subject;
import com.ssafy.connection.util.ModelMapperUtils;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.hibernate.type.LocalDateTimeType;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SubjectDto {
    @ApiModelProperty(readOnly = true)
    private long subjectId;
    private LocalDateTime deadline; // 제출 기한
    private List<Long> problemList;
    @ApiModelProperty(readOnly = true)
    private long studyId;

    public void setDeadline(String str){
        String[] list = str.split("-");
        LocalDateTime localDateTime = null;
        try {
            localDateTime = LocalDateTime.of(Integer.parseInt(list[0])
                    , Integer.parseInt(list[1])
                    , Integer.parseInt(list[2])
                    , 0, 0);
        }
        catch (Exception e){
            System.out.println("날짜 잘못됨");
        }
        this.deadline = localDateTime;
    }


    public static SubjectDto of(Subject subjectEntity) {
        SubjectDto subjectDto = ModelMapperUtils.getModelMapper().map(subjectEntity, SubjectDto.class);

        return subjectDto;
    }
}
