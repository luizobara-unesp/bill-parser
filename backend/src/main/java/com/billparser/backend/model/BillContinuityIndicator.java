package com.billparser.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "bill_continuity_indicators")
@Data
public class BillContinuityIndicator {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private Double dic;
    private Double fic;
    private Double dmic;
    private Double dicri;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id", nullable = false)
    private Bill bill;
}