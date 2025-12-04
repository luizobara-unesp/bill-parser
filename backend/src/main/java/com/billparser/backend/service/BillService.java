package com.billparser.backend.service;

import com.billparser.backend.client.ExtractorClient;
import com.billparser.backend.dto.extractor.AnalysisCompletaConta;
import com.billparser.backend.dto.extractor.BillSavedResponse;
import com.billparser.backend.dto.extractor.ItemFaturado;
import com.billparser.backend.dto.extractor.Tributo;
import com.billparser.backend.model.*;
import com.billparser.backend.repository.BillRepository;
import com.billparser.backend.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BillService {

    private final ExtractorClient extractorClient;
    private final WorkspaceRepository workspaceRepository;
    private final BillRepository billRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public AnalysisCompletaConta extractOnly(MultipartFile file) {
        return extractorClient.extractData(file);
    }

    @Transactional
    public Bill saveBillFromDTO(AnalysisCompletaConta analysis, Long workspaceId, User user) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace não encontrado!"));

        if (!workspace.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Acesso negado ao workspace.");
        }

        Bill bill = new Bill();
        bill.setWorkspace(workspace);

        mapDtoToEntity(bill, analysis);

        return billRepository.save(bill);
    }

    @Transactional
    public Bill updateBillFromDTO(Long billId, AnalysisCompletaConta analysis, User user) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        if (!bill.getWorkspace().getUser().getId().equals(user.getId())) {
            throw new SecurityException("Acesso negado.");
        }

        mapDtoToEntity(bill, analysis);

        return billRepository.save(bill);
    }

    @Transactional
    public BillSavedResponse deleteBill(Long billId, User user) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        if (!bill.getWorkspace().getUser().getId().equals(user.getId())) {
            throw new SecurityException("Acesso negado.");
        }

        AnalysisCompletaConta billDetails = getBillById(billId, user);

        billRepository.delete(bill);

        return BillSavedResponse.builder()
                .id(billId)
                .valorTotalPagar(BigDecimal.valueOf(bill.getTotalAmount()))
                .mesReferenciaGeral(bill.getReferenceMonth())
                .savedByUserId(user.getId())
                .statusMessage("Conta ID " + billId + " deletada com sucesso.")
                .build();
    }

    private void mapDtoToEntity(Bill bill, AnalysisCompletaConta analysis) {
        bill.setTotalAmount(analysis.getValor_total_pagar());

        if (analysis.getData_vencimento() != null) {
            bill.setDueDate(parseDateSafe(analysis.getData_vencimento()));
        }

        bill.setReferenceMonth(analysis.getMes_referencia_geral());
        bill.setPeakConsumptionKwh(analysis.getConsumo_ponta_kwh());
        bill.setOffPeakConsumptionKwh(analysis.getConsumo_fora_ponta_kwh());
        bill.setBillingDays(analysis.getDias_faturamento());
        bill.setTariffFlag(analysis.getBandeira_tarifaria());
        bill.setClientData(analysis.getDados_cliente());

        if (analysis.getDemanda_contratada() != null) {
            ContractedDemand cd = new ContractedDemand();
            cd.setType(safeString(analysis.getDemanda_contratada().get("tipo")));
            cd.setValueKw(convertToDouble(analysis.getDemanda_contratada().get("valor_kw")));
            bill.setContractedDemand(cd);
        }

        if (analysis.getNiveis_tensao() != null) {
            VoltageLevels vl = new VoltageLevels();
            vl.setContractedVoltage(safeString(analysis.getNiveis_tensao().get("contratado")));
            vl.setMinVoltage(safeString(analysis.getNiveis_tensao().get("minimo")));
            vl.setMaxVoltage(safeString(analysis.getNiveis_tensao().get("maximo")));
            bill.setVoltageLevels(vl);
        }

        if (analysis.getEquipamentos_medicao() != null) {
            MeteringEquipment me = new MeteringEquipment();
            me.setActiveEnergyMeter(safeString(analysis.getEquipamentos_medicao().get("energia_ativa")));
            me.setReactiveEnergyMeter(safeString(analysis.getEquipamentos_medicao().get("energia_reativa")));
            me.setLossRate(convertToDouble(analysis.getEquipamentos_medicao().get("taxa_perda_percent")));
            bill.setMeteringEquipment(me);
        }

        if (analysis.getDatas_leitura() != null) {
            ReadingDates rd = new ReadingDates();
            rd.setTotalDays(convertToInteger(analysis.getDatas_leitura().get("qtd_dias")));
            rd.setPreviousReadingDate(parseDateSafe((String) analysis.getDatas_leitura().get("leitura_anterior")));
            rd.setCurrentReadingDate(parseDateSafe((String) analysis.getDatas_leitura().get("leitura_atual")));
            rd.setNextReadingDate(parseDateSafe((String) analysis.getDatas_leitura().get("proxima_leitura_prevista")));
            bill.setReadingDates(rd);
        }

        if (bill.getItems() == null) bill.setItems(new ArrayList<>());
        else bill.getItems().clear();

        if (analysis.getItens_faturados() != null) {
            for (ItemFaturado dto : analysis.getItens_faturados()) {
                BillItem item = new BillItem();
                item.setDescription(dto.getDescricao());
                item.setReferenceMonth(dto.getMes_referencia());
                item.setQuantity(dto.getQuantidade() != null ? dto.getQuantidade() : 0.0);
                item.setTotalValue(dto.getValor_total());
                item.setBill(bill);
                bill.getItems().add(item);
            }
        }

        if (bill.getTaxes() == null) bill.setTaxes(new ArrayList<>());
        else bill.getTaxes().clear();

        if (analysis.getTributos_detalhados() != null) {
            for (Tributo dto : analysis.getTributos_detalhados()) {
                BillTax tax = new BillTax();
                tax.setName(dto.getNome());
                tax.setCalculationBase(dto.getBase_calculo() != null ? dto.getBase_calculo() : 0.0);
                tax.setTaxRate(dto.getAliquota() != null ? dto.getAliquota() : "0");
                tax.setValue(dto.getValor());
                tax.setBill(bill);
                bill.getTaxes().add(tax);
            }
        }

        if (bill.getTariffs() == null) bill.setTariffs(new ArrayList<>());
        else bill.getTariffs().clear();

        if (analysis.getTarifas_aneel() != null) {
            for (Map<String, Object> t : analysis.getTarifas_aneel()) {
                BillTariff tariff = new BillTariff();
                tariff.setDescription(safeString(t.get("descricao")));
                tariff.setValue(convertToDouble(t.get("valor")));
                tariff.setBill(bill);
                bill.getTariffs().add(tariff);
            }
        }

        if (bill.getMeterReadings() == null) bill.setMeterReadings(new ArrayList<>());
        else bill.getMeterReadings().clear();

        if (analysis.getDados_leitura_medidor() != null) {
            for (Map<String, Object> r : analysis.getDados_leitura_medidor()) {
                BillMeterReading bmr = new BillMeterReading();
                bmr.setDescription(safeString(r.get("descricao")));
                bmr.setCurrentReading(convertToDouble(r.get("atual")));
                bmr.setPreviousReading(convertToDouble(r.get("anterior")));
                bmr.setMultiplicationFactor(convertToDouble(r.get("fator_multiplicacao")));
                bmr.setBill(bill);
                bill.getMeterReadings().add(bmr);
            }
        }

        if (bill.getIndicators() == null) bill.setIndicators(new ArrayList<>());
        else bill.getIndicators().clear();

        if (analysis.getIndicadores_continuidade() != null) {
            for (Map<String, Object> ind : analysis.getIndicadores_continuidade()) {
                BillContinuityIndicator bci = new BillContinuityIndicator();
                bci.setDescription(safeString(ind.get("descricao")));
                bci.setDic(convertToDouble(ind.get("dic")));
                bci.setFic(convertToDouble(ind.get("fic")));
                bci.setDmic(convertToDouble(ind.get("dmic")));
                bci.setDicri(convertToDouble(ind.get("dicri")));
                bci.setBill(bill);
                bill.getIndicators().add(bci);
            }
        }

        if (bill.getHistory() == null) bill.setHistory(new ArrayList<>());
        else bill.getHistory().clear();

        var demoUtil = analysis.getDemonstrativo_utilizacao();
        if (demoUtil != null) {
            mapHistoryList(bill.getHistory(), demoUtil.get("consumo_ponta"), BillHistory.HistoryType.PEAK_CONSUMPTION, bill);
            mapHistoryList(bill.getHistory(), demoUtil.get("consumo_fora_ponta"), BillHistory.HistoryType.OFF_PEAK_CONSUMPTION, bill);
            mapHistoryList(bill.getHistory(), demoUtil.get("demanda"), BillHistory.HistoryType.DEMAND, bill);
        }
    }

    public AnalysisCompletaConta getBillById(Long billId, User user) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        if (!bill.getWorkspace().getUser().getId().equals(user.getId())) {
            throw new SecurityException("Acesso negado.");
        }

        AnalysisCompletaConta dto = new AnalysisCompletaConta();

        dto.setValor_total_pagar(bill.getTotalAmount());
        dto.setData_vencimento(bill.getDueDate() != null ? bill.getDueDate().format(DATE_FORMATTER) : null);
        dto.setMes_referencia_geral(bill.getReferenceMonth());
        dto.setConsumo_ponta_kwh(bill.getPeakConsumptionKwh());
        dto.setConsumo_fora_ponta_kwh(bill.getOffPeakConsumptionKwh());
        dto.setDias_faturamento(bill.getBillingDays());
        dto.setBandeira_tarifaria(bill.getTariffFlag());
        dto.setDados_cliente(bill.getClientData());

        if (bill.getContractedDemand() != null) {
            Map<String, Object> map = new HashMap<>();
            map.put("tipo", bill.getContractedDemand().getType());
            map.put("valor_kw", bill.getContractedDemand().getValueKw());
            dto.setDemanda_contratada(map);
        }

        if (bill.getVoltageLevels() != null) {
            Map<String, Object> map = new HashMap<>();
            map.put("contratado", bill.getVoltageLevels().getContractedVoltage());
            map.put("minimo", bill.getVoltageLevels().getMinVoltage());
            map.put("maximo", bill.getVoltageLevels().getMaxVoltage());
            dto.setNiveis_tensao(map);
        }

        if (bill.getMeteringEquipment() != null) {
            Map<String, Object> map = new HashMap<>();
            map.put("energia_ativa", bill.getMeteringEquipment().getActiveEnergyMeter());
            map.put("energia_reativa", bill.getMeteringEquipment().getReactiveEnergyMeter());
            map.put("taxa_perda_percent", bill.getMeteringEquipment().getLossRate());
            dto.setEquipamentos_medicao(map);
        }

        if (bill.getReadingDates() != null) {
            Map<String, Object> map = new HashMap<>();
            map.put("leitura_anterior", formatDate(bill.getReadingDates().getPreviousReadingDate()));
            map.put("leitura_atual", formatDate(bill.getReadingDates().getCurrentReadingDate()));
            map.put("proxima_leitura_prevista", formatDate(bill.getReadingDates().getNextReadingDate()));
            map.put("qtd_dias", bill.getReadingDates().getTotalDays());
            dto.setDatas_leitura(map);
        }

        dto.setItens_faturados(bill.getItems().stream().map(i -> {
            ItemFaturado item = new ItemFaturado();
            item.setDescricao(i.getDescription());
            item.setMes_referencia(i.getReferenceMonth());
            item.setQuantidade(i.getQuantity());
            item.setValor_total(i.getTotalValue());
            return item;
        }).collect(Collectors.toList()));

        dto.setTributos_detalhados(bill.getTaxes().stream().map(t -> {
            Tributo trib = new Tributo();
            trib.setNome(t.getName());
            trib.setBase_calculo(t.getCalculationBase());
            trib.setAliquota(t.getTaxRate());
            trib.setValor(t.getValue());
            return trib;
        }).collect(Collectors.toList()));

        Map<String, Object> demoUtil = new HashMap<>();
        List<Map<String, Object>> ponta = new ArrayList<>();
        List<Map<String, Object>> foraPonta = new ArrayList<>();
        List<Map<String, Object>> demanda = new ArrayList<>();

        for (BillHistory h : bill.getHistory()) {
            Map<String, Object> hMap = new HashMap<>();
            hMap.put("mes_referencia", h.getReferenceMonth());
            hMap.put("dias", h.getDays());

            if (h.getType() == BillHistory.HistoryType.PEAK_CONSUMPTION) {
                hMap.put("consumo_kwh", h.getValue());
                ponta.add(hMap);
            } else if (h.getType() == BillHistory.HistoryType.OFF_PEAK_CONSUMPTION) {
                hMap.put("consumo_kwh", h.getValue());
                foraPonta.add(hMap);
            } else if (h.getType() == BillHistory.HistoryType.DEMAND) {
                hMap.put("demanda_kw", h.getValue());
                demanda.add(hMap);
            }
        }

        demoUtil.put("consumo_ponta", ponta);
        demoUtil.put("consumo_fora_ponta", foraPonta);
        demoUtil.put("demanda", demanda);
        dto.setDemonstrativo_utilizacao(demoUtil);

        dto.setDados_leitura_medidor(bill.getMeterReadings().stream().map(r -> {
            Map<String, Object> map = new HashMap<>();
            map.put("descricao", r.getDescription());
            map.put("atual", r.getCurrentReading());
            map.put("anterior", r.getPreviousReading());
            map.put("fator_multiplicacao", r.getMultiplicationFactor());
            return map;
        }).collect(Collectors.toList()));

        dto.setIndicadores_continuidade(bill.getIndicators().stream().map(i -> {
            Map<String, Object> map = new HashMap<>();
            map.put("descricao", i.getDescription());
            map.put("dic", i.getDic());
            map.put("fic", i.getFic());
            map.put("dmic", i.getDmic());
            map.put("dicri", i.getDicri());
            return map;
        }).collect(Collectors.toList()));

        dto.setTarifas_aneel(bill.getTariffs().stream().map(t -> {
            Map<String, Object> map = new HashMap<>();
            map.put("descricao", t.getDescription());
            map.put("valor", t.getValue());
            return map;
        }).collect(Collectors.toList()));

        return dto;
    }

    public Page<BillSavedResponse> getAllBills(Long workspaceId, User user, Pageable pageable) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace não encontrado!"));

        if (!workspace.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Acesso negado.");
        }

        Page<Bill> billsPage = billRepository.findAllByWorkspaceId(workspaceId, pageable);

        return billsPage.map(bill -> BillSavedResponse.builder()
                .id(bill.getId())
                .valorTotalPagar(BigDecimal.valueOf(bill.getTotalAmount()))
                .mesReferenciaGeral(bill.getReferenceMonth())
                .savedByUserId(user.getId())
                .statusMessage("OK")
                .build()
        );
    }

    private void mapHistoryList(List<BillHistory> targetList, Object sourceListObj, BillHistory.HistoryType type, Bill bill) {
        if (sourceListObj instanceof List) {
            List<Map<String, Object>> sourceList = (List<Map<String, Object>>) sourceListObj;
            for (Map<String, Object> h : sourceList) {
                BillHistory bh = new BillHistory();
                bh.setReferenceMonth(safeString(h.get("mes_referencia")));

                Double val = convertToDouble(h.getOrDefault("consumo_kwh", h.get("demanda_kw")));
                bh.setValue(val);

                bh.setDays(convertToInteger(h.get("dias")));
                bh.setType(type);
                bh.setBill(bill);
                targetList.add(bh);
            }
        }
    }

    private Double convertToDouble(Object value) {
        if (value == null) return 0.0;
        if (value instanceof Number) return ((Number) value).doubleValue();
        try { return Double.parseDouble(value.toString()); } catch (Exception e) { return 0.0; }
    }

    private Integer convertToInteger(Object value) {
        if (value == null) return 0;
        if (value instanceof Number) return ((Number) value).intValue();
        try { return Integer.parseInt(value.toString()); } catch (Exception e) { return 0; }
    }

    private String safeString(Object obj) {
        return obj != null ? String.valueOf(obj) : null;
    }

    private LocalDate parseDateSafe(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) return null;
        try { return LocalDate.parse(dateStr, DATE_FORMATTER); } catch (Exception e) { return null; }
    }

    private String formatDate(LocalDate date) {
        return date != null ? date.format(DATE_FORMATTER) : null;
    }
}