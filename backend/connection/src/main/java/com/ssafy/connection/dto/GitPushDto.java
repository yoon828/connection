package com.ssafy.connection.dto;

import com.ssafy.connection.entity.Workbook;
import com.ssafy.connection.util.ModelMapperUtils;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class GitPushDto {
    private String problemId;

    private MultipartFile file;

}
