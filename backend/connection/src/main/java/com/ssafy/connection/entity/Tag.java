package com.ssafy.connection.entity;

import com.ssafy.connection.dto.TagDto;
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
@Table(name = "Tag")
public class Tag {
    @Id
    @Column(name = "tag_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long tagId;

    private String key;  // 영어 이름

    private String name; // 한글 이름

    /* 연관관계 매핑 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problemId")
    private Problem problem;
    ////////////////////////////////////////

    public static Tag of(TagDto tagDto) {
        Tag tagEntity = ModelMapperUtils.getModelMapper().map(tagDto, Tag.class);

        return tagEntity;
    }
}
