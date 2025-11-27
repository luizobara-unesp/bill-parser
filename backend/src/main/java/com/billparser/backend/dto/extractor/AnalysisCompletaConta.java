package com.billparser.backend.dto.extractor;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class AnalysisCompletaConta {
    @JsonProperty("valor_total_pagar")
    private Double valor_total_pagar;

    @JsonProperty("data_vencimento")
    private String data_vencimento;

    @JsonProperty("mes_referencia_geral")
    private String mes_referencia_geral;

    @JsonProperty("consumo_ponta_kwh")
    private Double consumo_ponta_kwh;

    @JsonProperty("consumo_fora_ponta_kwh")
    private Double consumo_fora_ponta_kwh;

    @JsonProperty("dias_faturamento")
    private Integer dias_faturamento;

    @JsonProperty("itens_faturados")
    private List<ItemFaturado> itens_faturados;

    @JsonProperty("tributos_detalhados")
    private List<Tributo> tributos_detalhados;

    @JsonProperty("avisos_importantes")
    private List<String> avisos_importantes;

    @JsonProperty("bandeira_tarifaria")
    private String bandeira_tarifaria;

    @JsonProperty("dados_cliente")
    private String dados_cliente;

    @JsonProperty("demanda_contratada")
    private Map<String, Object> demanda_contratada;

    @JsonProperty("datas_leitura")
    private Map<String, Object> datas_leitura;

    @JsonProperty("tarifas_aneel")
    private List<Map<String, Object>> tarifas_aneel;

    @JsonProperty("equipamentos_medicao")
    private Map<String, Object> equipamentos_medicao;

    @JsonProperty("demonstrativo_utilizacao")
    private Map<String, Object> demonstrativo_utilizacao;

    @JsonProperty("dados_leitura_medidor")
    private List<Map<String, Object>> dados_leitura_medidor;

    @JsonProperty("niveis_tensao")
    private Map<String, Object> niveis_tensao;

    @JsonProperty("indicadores_continuidade")
    private List<Map<String, Object>> indicadores_continuidade;
}