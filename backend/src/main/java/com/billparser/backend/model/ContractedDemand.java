package com.billparser.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class ContractedDemand {
    @Column(name = "demand_type")
    private String type;

    @Column(name = "demand_value_kw")
    private Double valueKw;
}