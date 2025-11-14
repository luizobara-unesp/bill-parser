package com.billparser.backend.dto.extractor;

import lombok.Data;

@Data
public class Tributo {
    private String nome;
    private Double base_calculo;
    private String aliquota;
    private Double valor;
}