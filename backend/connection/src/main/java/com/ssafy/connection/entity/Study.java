package com.ssafy.connection.entity;

import com.ssafy.connection.dto.ProblemDto;
import com.ssafy.connection.dto.StudyDto;
import com.ssafy.connection.util.ModelMapperUtils;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "Study")
public class Study {
    @Id
    @Column(name = "study_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long studyId;

    @Column(name = "study_code")
    private String studyCode;

    @Column(name = "study_name")
    private String studyName;

    /* 연관관계 매핑 */

    ////////////////////////////////////////

    public static Study of(StudyDto studyDto) {
        Study studyEntity = ModelMapperUtils.getModelMapper().map(studyDto, Study.class);

        return studyEntity;
    }
}
