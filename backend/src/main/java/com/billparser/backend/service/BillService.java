package com.billparser.backend.service;

import com.billparser.backend.client.ExtractorClient;
import com.billparser.backend.dto.extractor.AnalysisCompletaConta;
import com.billparser.backend.dto.extractor.ItemFaturado;
import com.billparser.backend.dto.extractor.Tributo;
import com.billparser.backend.model.*;
import com.billparser.backend.repository.BillRepository;
import com.billparser.backend.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.billparser.backend.dto.extractor.BillSavedResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

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
    public Bill processAndSaveBill(MultipartFile file, Long workspaceId, User user) {

        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace não encontrado!"));

        if (!workspace.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Acesso negado ao workspace.");
        }

        AnalysisCompletaConta analysis = extractorClient.extractData(file);

        Bill bill = new Bill();
        bill.setWorkspace(workspace);

        bill.setValorTotalPagar(analysis.getValor_total_pagar());

        bill.setDataVencimento(LocalDate.parse(analysis.getData_vencimento(), DATE_FORMATTER));
        bill.setMesReferenciaGeral(analysis.getMes_referencia_geral());

        Double consumoPonta = analysis.getConsumo_ponta_kwh() != null ? analysis.getConsumo_ponta_kwh() : 0.0;
        Double consumoForaPonta = analysis.getConsumo_fora_ponta_kwh() != null ? analysis.getConsumo_fora_ponta_kwh() : 0.0;

        bill.setConsumoTotalKwh((int) (consumoPonta + consumoForaPonta));

        bill.setDiasFaturamento(analysis.getDias_faturamento());
        bill.setBandeiraTarifaria(analysis.getBandeira_tarifaria());

        List<BillItem> items = new ArrayList<>();
        if (analysis.getItens_faturados() != null) {
            for (ItemFaturado itemDto : analysis.getItens_faturados()) {
                BillItem item = new BillItem();
                item.setDescricao(itemDto.getDescricao());
                item.setMesReferencia(itemDto.getMes_referencia());

                if (itemDto.getQuantidade() != null) {
                    item.setQuantidade(itemDto.getQuantidade());
                } else {
                    item.setQuantidade(0.0);
                }

                item.setValorTotal(itemDto.getValor_total());
                item.setBill(bill);
                items.add(item);
            }
        }
        bill.setItens(items);

        List<BillTax> taxes = new ArrayList<>();
        if (analysis.getTributos_detalhados() != null) {
            for (Tributo taxDto : analysis.getTributos_detalhados()) {
                BillTax tax = new BillTax();
                tax.setNome(taxDto.getNome());

                tax.setBaseCalculo(taxDto.getBase_calculo() != null ? taxDto.getBase_calculo() : 0.0);
                tax.setAliquota(taxDto.getAliquota() != null ? taxDto.getAliquota() : "0");

                tax.setValor(taxDto.getValor());
                tax.setBill(bill);
                taxes.add(tax);
            }
        }
        bill.setTributos(taxes);

        return billRepository.save(bill);
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
        bill.setValorTotalPagar(analysis.getValor_total_pagar());

        if (analysis.getData_vencimento() != null) {
            bill.setDataVencimento(LocalDate.parse(analysis.getData_vencimento(), DATE_FORMATTER));
        }

        bill.setMesReferenciaGeral(analysis.getMes_referencia_geral());

        Double consumoPonta = analysis.getConsumo_ponta_kwh() != null ? analysis.getConsumo_ponta_kwh() : 0.0;
        Double consumoForaPonta = analysis.getConsumo_fora_ponta_kwh() != null ? analysis.getConsumo_fora_ponta_kwh() : 0.0;
        bill.setConsumoTotalKwh((int) (consumoPonta + consumoForaPonta));

        bill.setDiasFaturamento(analysis.getDias_faturamento());
        bill.setBandeiraTarifaria(analysis.getBandeira_tarifaria());

        List<BillItem> items = new ArrayList<>();
        if (analysis.getItens_faturados() != null) {
            for (ItemFaturado itemDto : analysis.getItens_faturados()) {
                BillItem item = new BillItem();
                item.setDescricao(itemDto.getDescricao());
                item.setMesReferencia(itemDto.getMes_referencia());
                item.setQuantidade(itemDto.getQuantidade() != null ? itemDto.getQuantidade() : 0.0);
                item.setValorTotal(itemDto.getValor_total());
                item.setBill(bill);
                items.add(item);
            }
        }
        bill.setItens(items);

        List<BillTax> taxes = new ArrayList<>();
        if (analysis.getTributos_detalhados() != null) {
            for (Tributo taxDto : analysis.getTributos_detalhados()) {
                BillTax tax = new BillTax();
                tax.setNome(taxDto.getNome());
                tax.setBaseCalculo(taxDto.getBase_calculo() != null ? taxDto.getBase_calculo() : 0.0);
                tax.setAliquota(taxDto.getAliquota() != null ? taxDto.getAliquota() : "0");
                tax.setValor(taxDto.getValor());
                tax.setBill(bill);
                taxes.add(tax);
            }
        }
        bill.setTributos(taxes);

        return billRepository.save(bill);
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
                .valorTotalPagar(BigDecimal.valueOf(bill.getValorTotalPagar()))
                .mesReferenciaGeral(bill.getMesReferenciaGeral())
                .savedByUserId(user.getId())
                .statusMessage("OK")
                .build()
        );
    }

    public AnalysisCompletaConta getBillById(Long billId, User user) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        if (!bill.getWorkspace().getUser().getId().equals(user.getId())) {
            throw new SecurityException("Acesso negado.");
        }

        AnalysisCompletaConta dto = new AnalysisCompletaConta();
        dto.setValor_total_pagar(bill.getValorTotalPagar());
        dto.setData_vencimento(bill.getDataVencimento().format(DATE_FORMATTER));
        dto.setMes_referencia_geral(bill.getMesReferenciaGeral());

        dto.setDias_faturamento(bill.getDiasFaturamento());
        dto.setBandeira_tarifaria(bill.getBandeiraTarifaria());

        List<ItemFaturado> itensDto = new ArrayList<>();
        for (BillItem item : bill.getItens()) {
            ItemFaturado i = new ItemFaturado();
            i.setDescricao(item.getDescricao());
            i.setMes_referencia(item.getMesReferencia());
            i.setQuantidade(item.getQuantidade());
            i.setValor_total(item.getValorTotal());
            itensDto.add(i);
        }
        dto.setItens_faturados(itensDto);

        List<Tributo> taxDto = new ArrayList<>();
        for (BillTax tax : bill.getTributos()) {
            Tributo t = new Tributo();
            t.setNome(tax.getNome());
            t.setBase_calculo(tax.getBaseCalculo());
            t.setAliquota(tax.getAliquota());
            t.setValor(tax.getValor());
            taxDto.add(t);
        }
        dto.setTributos_detalhados(taxDto);

        return dto;
    }

}