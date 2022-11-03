package com.ssafy.connection.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public interface SolveStudyMemberStatsInterface {
    LocalDate getDate();
    Long getCount();
}
