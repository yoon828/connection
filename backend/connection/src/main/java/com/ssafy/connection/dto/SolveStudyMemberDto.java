package com.ssafy.connection.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SolveStudyMemberDto {
    //@DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM", timezone = "Asia/Seoul")
    private LocalDate date;

    private Float problemCnt;

    private Float subjectCnt;

    private Float problemAvgCnt;

    private Float subjectAvgCnt;

}
