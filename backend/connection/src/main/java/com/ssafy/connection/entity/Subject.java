package com.ssafy.connection.entity;

import com.ssafy.connection.dto.ProblemDto;
import com.ssafy.connection.dto.SubjectDto;
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
@Table(name = "Subject")
public class Subject {
    @Id
    @Column(name = "subjcet_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long subjectId;

    private LocalDateTime deadline; // 제출 기한

    /* 연관관계 매핑 */

    ////////////////////////////////////////

    public static Subject of(SubjectDto subjectDto) {
        Subject subjectEntity = ModelMapperUtils.getModelMapper().map(subjectDto, Subject.class);

        return subjectEntity;
    }
}
