package com.billparser.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "bill_history")
@Data
public class BillHistory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_month")
    private String referenceMonth;

    @Enumerated(EnumType.STRING)
    private HistoryType type;

    private Double value;
    private Integer days;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id", nullable = false)
    private Bill bill;

    public enum HistoryType {
        PEAK_CONSUMPTION,
        OFF_PEAK_CONSUMPTION,
        DEMAND
    }
}