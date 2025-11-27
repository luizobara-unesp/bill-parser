package com.billparser.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class MeteringEquipment {
    @Column(name = "active_energy_meter")
    private String activeEnergyMeter;

    @Column(name = "reactive_energy_meter")
    private String reactiveEnergyMeter;

    @Column(name = "loss_rate_percent")
    private Double lossRate;
}