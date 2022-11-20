package com.ssafy.connection.dto;

import com.ssafy.connection.entity.Workbook;
import com.ssafy.connection.util.ModelMapperUtils;

public class WorkbookDto {
    private long workbookId;

    private String workbookName;

    public static WorkbookDto of(Workbook workbookEntity) {
        WorkbookDto workbookDto = ModelMapperUtils.getModelMapper().map(workbookEntity, WorkbookDto.class);

        return workbookDto;
    }
}
