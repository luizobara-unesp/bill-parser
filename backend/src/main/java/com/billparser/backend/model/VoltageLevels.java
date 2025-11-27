package com.billparser.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class VoltageLevels {
    @Column(name = "contracted_voltage")
    private String contractedVoltage;

    @Column(name = "min_voltage")
    private String minVoltage;

    @Column(name = "max_voltage")
    private String maxVoltage;
}