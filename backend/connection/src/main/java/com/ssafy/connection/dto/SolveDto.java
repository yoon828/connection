package com.ssafy.connection.dto;

import com.ssafy.connection.entity.Solve;
import com.ssafy.connection.util.ModelMapperUtils;

import java.time.LocalDateTime;

public class SolveDto {
    private long solveId;

    private int status; // 성공 실패 여부

    private LocalDateTime time; // 문제 푼 시각

    public static SolveDto of(Solve solveEntity) {
        SolveDto solveDto = ModelMapperUtils.getModelMapper().map(solveEntity, SolveDto.class);

        return solveDto;
    }
}
