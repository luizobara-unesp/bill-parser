package com.billparser.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "bill_taxes")
@Data
public class BillTax {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "calculation_base")
    private Double calculationBase;

    @Column(name = "tax_rate")
    private String taxRate;

    private Double value;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id", nullable = false)
    private Bill bill;
}