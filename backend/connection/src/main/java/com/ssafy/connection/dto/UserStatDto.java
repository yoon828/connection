package com.ssafy.connection.dto;

import lombok.*;

@Data
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatDto {
    private String type;
    private int cnt;
}
