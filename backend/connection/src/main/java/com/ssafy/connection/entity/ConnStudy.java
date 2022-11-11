package com.ssafy.connection.entity;

import com.ssafy.connection.dto.ConnStudyDto;
import com.ssafy.connection.securityOauth.domain.entity.user.User;
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
@Table(name = "ConnStudy")
public class ConnStudy {
    @Id
    @Column(name = "connStudy_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long connStudyId;

    private String role;

    @Column(name = "joined_date")
    private LocalDateTime joinedDate;

    /* 연관관계 매핑 */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studyId")
    private Study study;
    ////////////////////////////////////////

    public static ConnStudy of(ConnStudyDto connStudyDto) {
        ConnStudy connStudyEntity = ModelMapperUtils.getModelMapper().map(connStudyDto, ConnStudy.class);

        return connStudyEntity;
    }
}
