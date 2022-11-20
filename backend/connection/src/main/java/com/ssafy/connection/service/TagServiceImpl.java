package com.ssafy.connection.service;

import com.ssafy.connection.entity.Tag;
import com.ssafy.connection.repository.TagRepository;
import org.springframework.stereotype.Service;

@Service
public class TagServiceImpl implements TagService{

    private final TagRepository tagRepository;

    TagServiceImpl(TagRepository tagRepository){
        this.tagRepository = tagRepository;
    }

    @Override
    public void save(Tag tag) {
        tagRepository.save(tag);
    }
}
