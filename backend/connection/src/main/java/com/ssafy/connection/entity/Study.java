package com.ssafy.connection.entity;

import com.ssafy.connection.dto.StudyDto;
import com.ssafy.connection.util.ModelMapperUtils;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

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

    @Column(name = "study_repository")
    private String studyRepository;

    @Column(name = "study_personnel")
    private int studyPersonnel;

    /* 연관관계 매핑 */
    @OneToOne(mappedBy = "study")
    private Workbook workbook;

    @OneToMany(mappedBy = "study")
    List<Subject> subject = new ArrayList<>();

    @OneToMany(mappedBy = "study")
    List<ConnStudy> connStudy = new ArrayList<>();
    ////////////////////////////////////////

    public static Study of(StudyDto studyDto) {
        Study studyEntity = ModelMapperUtils.getModelMapper().map(studyDto, Study.class);

        return studyEntity;
    }
}
