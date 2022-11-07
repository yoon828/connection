package com.ssafy.connection.dto;

import com.ssafy.connection.entity.Workbook;
import com.ssafy.connection.util.ModelMapperUtils;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@ToString
public class GitPushDto {
    private String submitNo;
    private String userId;
    private String problemNo;
    private String code;
    private String lang;
}
