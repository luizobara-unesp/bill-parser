package com.billparser.backend.dto.extractor;

import lombok.Data;

@Data
public class ItemFaturado {
    private String descricao;
    private String mes_referencia;
    private Double quantidade;
    private Double valor_total;
}