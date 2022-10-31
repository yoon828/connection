package com.ssafy.connection.dto;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemReturnDto {
    private ProblemDto problemInfo;
    private List<TagDto> tagList;
    private long difficulty;

    public ProblemReturnDto(ProblemDto problemDto, List<TagDto> tagList){
        this.problemInfo = problemDto;
        this.tagList = tagList;
    }
}
