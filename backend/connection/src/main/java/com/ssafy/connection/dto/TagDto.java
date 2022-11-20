package com.ssafy.connection.dto;

import com.ssafy.connection.entity.Tag;
import com.ssafy.connection.util.ModelMapperUtils;
import lombok.*;

@Data
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TagDto {
    private long tagId;

    private String en;  // 영어 이름

    private String ko; // 한글 이름

    public static TagDto of(Tag tagEntity) {
        TagDto tagDto = ModelMapperUtils.getModelMapper().map(tagEntity, TagDto.class);

        return tagDto;
    }
}
