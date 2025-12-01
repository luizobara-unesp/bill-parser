package com.billparser.backend.controller;

import com.billparser.backend.dto.report.ConsumptionReport;
import com.billparser.backend.dto.report.HistoryReport;
import com.billparser.backend.model.User;
import com.billparser.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/consumption")
    public ResponseEntity<List<ConsumptionReport>> getConsumptionReport(
            @RequestParam("workspaceId") Long workspaceId
    ) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<ConsumptionReport> reportData = reportService.getConsumptionHistory(workspaceId, currentUser);

        return ResponseEntity.ok(reportData);
    }

    @GetMapping("/bill/{billId}/history")
    public ResponseEntity<List<HistoryReport>> getBillHistoryChart(@PathVariable Long billId) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<HistoryReport> historyData = reportService.getBillSpecificHistory(billId, currentUser);

        return ResponseEntity.ok(historyData);
    }
}