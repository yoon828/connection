package com.ssafy.connection.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyReadmeDto {
    Long studyId;
    String msg;
}
