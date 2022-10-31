package com.ssafy.connection.repository;

import com.ssafy.connection.dto.TagDto;
import com.ssafy.connection.entity.Problem;
import com.ssafy.connection.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    ArrayList<TagDto> findAllByProblem(Problem problem);
}
