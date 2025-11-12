package com.billparser.backend.dto.extractor;

import lombok.Data;
import java.util.List;

@Data
public class AnalysisCompletaConta {
    private Double valor_total_pagar;
    private String data_vencimento;
    private String mes_referencia_geral;
    private Integer consumo_total_kwh;
    private Integer dias_faturamento;
    private List<ItemFaturado> itens_faturados;
    private List<Tributo> tributos_detalhados;
    private List<String> avisos_importantes;
    private String bandeira_tarifaria;
    private String dados_cliente;
}