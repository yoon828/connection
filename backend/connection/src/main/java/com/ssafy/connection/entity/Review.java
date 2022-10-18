package com.ssafy.connection.entity;

import com.ssafy.connection.dto.ProblemDto;
import com.ssafy.connection.dto.ReviewDto;
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
@Table(name = "Review")
public class Review {
    @Id
    @Column(name = "review_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long reviewId;

    private int difficulty; // 난이도

    private LocalDateTime time; // 소요 시간

    /* 연관관계 매핑 */

    ////////////////////////////////////////

    public static Review of(ReviewDto reviewDto) {
        Review reviewEntity = ModelMapperUtils.getModelMapper().map(reviewDto, Review.class);

        return reviewEntity;
    }
}
