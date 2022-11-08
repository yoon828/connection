package com.ssafy.connection.dto;

import com.ssafy.connection.entity.Workbook;
import com.ssafy.connection.util.ModelMapperUtils;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@ToString
//@Builder
@NoArgsConstructor
public class GitPushDto {
    private String submitNo;
    private String userId;  //리드미에 필요
    private String problemNo;   //리드미에 필요
    private String code;
    private String lang;
}
