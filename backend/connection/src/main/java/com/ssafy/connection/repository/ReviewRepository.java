package com.ssafy.connection.repository;

import com.ssafy.connection.entity.Problem;
import com.ssafy.connection.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findAllByProblem(Problem problemEntity);
}
