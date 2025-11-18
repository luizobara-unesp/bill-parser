package com.billparser.backend.dto.extractor;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class AnalysisCompletaConta {
    private Double valor_total_pagar;
    private String data_vencimento;
    private String mes_referencia_geral;
    private Double consumo_ponta_kwh;
    private Double consumo_fora_ponta_kwh;
    private Integer dias_faturamento;

    private List<ItemFaturado> itens_faturados;
    private List<Tributo> tributos_detalhados;

    private List<String> avisos_importantes;
    private String bandeira_tarifaria;
    private String dados_cliente;

    private Map<String, Object> demanda_contratada;
    private Map<String, Object> datas_leitura;
    private List<Map<String, Object>> tarifas_aneel;
    private Map<String, Object> equipamentos_medicao;

    private Map<String, Object> demonstrativo_utilizacao;

    private List<Map<String, Object>> dados_leitura_medidor;
    private Map<String, Object> niveis_tensao;
    private List<Map<String, Object>> indicadores_continuidade;
}