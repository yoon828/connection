package com.ssafy.connection.entity;

import com.ssafy.connection.dto.ProblemDto;
import com.ssafy.connection.dto.SolveDto;
import com.ssafy.connection.util.ModelMapperUtils;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "Solve")
public class Solve {
    @Id
    @Column(name = "solve_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long solveId;

    private int status; // 성공 실패 여부

    private LocalDateTime time; // 문제 푼 시각

    /* 연관관계 매핑 */

    ////////////////////////////////////////

    public static Solve of(SolveDto solveDto) {
        Solve solveEntity = ModelMapperUtils.getModelMapper().map(solveDto, Solve.class);

        return solveEntity;
    }
}
