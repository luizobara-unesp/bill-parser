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
        bill.setConsumoTotalKwh(analysis.getConsumo_total_kwh());
        bill.setDiasFaturamento(analysis.getDias_faturamento());
        bill.setBandeiraTarifaria(analysis.getBandeira_tarifaria());

        List<BillItem> items = new ArrayList<>();
        for (ItemFaturado itemDto : analysis.getItens_faturados()) {
            BillItem item = new BillItem();
            item.setDescricao(itemDto.getDescricao());
            item.setMesReferencia(itemDto.getMes_referencia());
            item.setQuantidade(itemDto.getQuantidade());
            item.setValorTotal(itemDto.getValor_total());
            item.setBill(bill);
            items.add(item);
        }
        bill.setItens(items);

        List<BillTax> taxes = new ArrayList<>();
        for (Tributo taxDto : analysis.getTributos_detalhados()) {
            BillTax tax = new BillTax();
            tax.setNome(taxDto.getNome());
            tax.setBaseCalculo(taxDto.getBase_calculo());
            tax.setAliquota(taxDto.getAliquota());
            tax.setValor(taxDto.getValor());
            tax.setBill(bill);
            taxes.add(tax);
        }
        bill.setTributos(taxes);

        return billRepository.save(bill);
    }
}