package com.ssafy.connection.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseDto {
    @Schema(description = "메세지")
    String msg;
}
