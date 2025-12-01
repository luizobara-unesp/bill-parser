package com.billparser.backend.dto.report;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ConsumptionReport {
    private String month;
    private Double totalValue;
    private Double totalConsumptionKwh;

    private Double peakConsumption;
    private Double offPeakConsumption;
}
