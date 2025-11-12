package com.billparser.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "bill_taxes")
@Data
public class BillTax {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private Double baseCalculo;
    private String aliquota;
    private Double valor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id", nullable = false)
    private Bill bill;
}