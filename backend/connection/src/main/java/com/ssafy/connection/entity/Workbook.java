package com.ssafy.connection.entity;

import com.ssafy.connection.dto.WorkbookDto;
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
@Table(name = "Workbook")
public class Workbook {
    @Id
    @Column(name = "workbook_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long workbookId;

    @Column(name = "workbook_name")
    private String workbookName;

    /* 연관관계 매핑 */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studyId", unique = true)
    private Study study;

    @OneToMany(mappedBy = "workbook")
    List<ConnWorkbook> connWorkbook = new ArrayList<>();
    ////////////////////////////////////////

    public static Workbook of(WorkbookDto workbookDto) {
        Workbook workbookEntity = ModelMapperUtils.getModelMapper().map(workbookDto, Workbook.class);

        return workbookEntity;
    }
}
