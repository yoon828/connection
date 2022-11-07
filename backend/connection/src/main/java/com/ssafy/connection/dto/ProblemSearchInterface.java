package com.ssafy.connection.dto;

import lombok.*;

public interface ProblemSearchInterface {
    Long getProblemId();
    String getTitle();
    Long getAccepted();
    Long getLevel();
    String getTries();
    Long getTagId();
    String getEn();
    String getKo();
}
