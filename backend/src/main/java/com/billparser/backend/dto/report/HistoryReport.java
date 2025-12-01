package com.billparser.backend.dto.report;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HistoryReport {
    private String month;
    private Double peakConsumption;
    private Double offPeakConsumption;
    private Double demand;
    private Integer days;
}