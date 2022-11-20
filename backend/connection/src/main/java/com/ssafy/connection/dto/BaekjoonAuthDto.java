package com.ssafy.connection.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class BaekjoonAuthDto {
    @Schema(description = "백준아이디")
    private String baekjoonId;

    @Schema(description = "코드")
    private String code;
}
