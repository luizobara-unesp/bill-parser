package com.billparser.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "bill_meter_readings")
@Data
public class BillMeterReading {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    @Column(name = "current_reading")
    private Double currentReading;

    @Column(name = "previous_reading")
    private Double previousReading;

    @Column(name = "multiplication_factor")
    private Double multiplicationFactor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id", nullable = false)
    private Bill bill;
}