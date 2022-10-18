package com.ssafy.connection.entity;

import com.ssafy.connection.dto.ConnWorkbookDto;
import com.ssafy.connection.dto.ProblemDto;
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
@Table(name = "ConnWorkbook")
public class ConnWorkbook {
    @Id
    @Column(name = "conn_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long connId;

    /* 연관관계 매핑 */

    ////////////////////////////////////////

    public static ConnWorkbook of(ConnWorkbookDto connWorkbookDto) {
        ConnWorkbook connWorkbookEntity = ModelMapperUtils.getModelMapper().map(connWorkbookDto, ConnWorkbook.class);

        return connWorkbookEntity;
    }
}
