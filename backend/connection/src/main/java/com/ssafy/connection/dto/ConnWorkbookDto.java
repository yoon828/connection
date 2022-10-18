package com.ssafy.connection.dto;

import com.ssafy.connection.entity.ConnWorkbook;
import com.ssafy.connection.util.ModelMapperUtils;

public class ConnWorkbookDto {
    private long connId;

    public static ConnWorkbookDto of(ConnWorkbook connWorkbookEntity) {
        ConnWorkbookDto connWorkbookDto = ModelMapperUtils.getModelMapper().map(connWorkbookEntity, ConnWorkbookDto.class);

        return connWorkbookDto;
    }
}
