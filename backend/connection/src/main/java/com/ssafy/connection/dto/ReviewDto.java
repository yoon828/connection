package com.ssafy.connection.dto;

import com.ssafy.connection.entity.Review;
import com.ssafy.connection.util.ModelMapperUtils;

import java.time.LocalDateTime;

public class ReviewDto {
    private long reviewId;

    private int difficulty; // 난이도

    private LocalDateTime time; // 소요 시간

    public static ReviewDto of(Review reviewEntity) {
        ReviewDto reviewDto = ModelMapperUtils.getModelMapper().map(reviewEntity, ReviewDto.class);

        return reviewDto;
    }
}
