package com.billparser.backend.service;

import com.billparser.backend.dto.report.ConsumptionReport;
import com.billparser.backend.dto.report.HistoryReport;
import com.billparser.backend.model.Bill;
import com.billparser.backend.model.BillHistory;
import com.billparser.backend.model.User;
import com.billparser.backend.model.Workspace;
import com.billparser.backend.repository.BillRepository;
import com.billparser.backend.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final BillRepository billRepository;
    private final WorkspaceRepository workspaceRepository;

    public List<ConsumptionReport> getConsumptionHistory(Long workspaceId, User user) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace não encontrado"));

        if (!workspace.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Acesso negado.");
        }

        List<Bill> bills = billRepository.findAllByWorkspaceIdOrderByDueDateAsc(workspaceId);

        return bills.stream().map(bill -> {
            Double totalKwh = (bill.getPeakConsumptionKwh() != null ? bill.getPeakConsumptionKwh() : 0.0) +
                    (bill.getOffPeakConsumptionKwh() != null ? bill.getOffPeakConsumptionKwh() : 0.0);

            return ConsumptionReport.builder()
                    .month(bill.getReferenceMonth())
                    .totalValue(bill.getTotalAmount())
                    .totalConsumptionKwh(totalKwh)
                    .peakConsumption(bill.getPeakConsumptionKwh())
                    .offPeakConsumption(bill.getOffPeakConsumptionKwh())
                    .build();
        }).collect(Collectors.toList());
    }

    public List<HistoryReport> getBillSpecificHistory(Long billId, User user) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        if (!bill.getWorkspace().getUser().getId().equals(user.getId())) {
            throw new SecurityException("Acesso negado.");
        }

        Map<String, HistoryReport.HistoryReportBuilder> groupingMap = new java.util.LinkedHashMap<>();

        for (BillHistory h : bill.getHistory()) {
            String month = h.getReferenceMonth();

            groupingMap.putIfAbsent(month, HistoryReport.builder().month(month));

            var builder = groupingMap.get(month);

            if (h.getDays() != null) {
                builder.days(h.getDays());
            }
            if (h.getType() == BillHistory.HistoryType.PEAK_CONSUMPTION) {
                builder.peakConsumption(h.getValue());
            } else if (h.getType() == BillHistory.HistoryType.OFF_PEAK_CONSUMPTION) {
                builder.offPeakConsumption(h.getValue());
            } else if (h.getType() == BillHistory.HistoryType.DEMAND) {
                builder.demand(h.getValue());
            }
        }

        return groupingMap.values().stream()
                .map(HistoryReport.HistoryReportBuilder::build)
                .collect(Collectors.toList());
    }
}