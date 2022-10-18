package com.ssafy.connection.dto;

import com.ssafy.connection.entity.Problem;
import com.ssafy.connection.entity.Tag;
import com.ssafy.connection.util.ModelMapperUtils;

public class TagDto {
    private long tagId;

    private String key;  // 영어 이름

    private String name; // 한글 이름

    public static TagDto of(Tag tagEntity) {
        TagDto tagDto = ModelMapperUtils.getModelMapper().map(tagEntity, TagDto.class);

        return tagDto;
    }
}
