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
public class ProblemTagDto {
    private ProblemDto problem;
    private List<TagDto> tagList;
}
