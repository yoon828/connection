package com.ssafy.connection.repository;

import com.ssafy.connection.entity.Study;
import com.ssafy.connection.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    List<Subject> findAllByStudy(Study studyEntity);
}
