package com.billparser.backend.controller;

import com.billparser.backend.dto.extractor.AnalysisCompletaConta;
import com.billparser.backend.model.Bill;
import com.billparser.backend.model.User;
import com.billparser.backend.service.BillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

import com.billparser.backend.dto.extractor.BillSavedResponse;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/bills")
@RequiredArgsConstructor
public class BillController {

    private final BillService billService;

    @PostMapping
    public ResponseEntity<BillSavedResponse> createBill (
            @RequestBody AnalysisCompletaConta billData,
            @RequestParam("workspaceId") Long workspaceId
    ) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Bill savedBill = billService.saveBillFromDTO(billData, workspaceId, currentUser);

        BillSavedResponse response = BillSavedResponse.builder()
                .id(savedBill.getId())
                .valorTotalPagar(BigDecimal.valueOf(savedBill.getValorTotalPagar()))
                .mesReferenciaGeral(savedBill.getMesReferenciaGeral())
                .savedByUserId(currentUser.getId())
                .statusMessage("Conta ID " + savedBill.getId() + " salva e aprovada com sucesso.")
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/extract")
    public ResponseEntity<AnalysisCompletaConta> extractBillData (
            @RequestParam("file") MultipartFile file
    ) {
        AnalysisCompletaConta extractedData = billService.extractOnly(file);
        return ResponseEntity.ok(extractedData);
    }

    @GetMapping
    public ResponseEntity<Page<BillSavedResponse>> getAllBills (
            @RequestParam("workspaceId") Long workspaceId,
            @PageableDefault(size = 10, sort = "dataVencimento", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Page<BillSavedResponse> bills = billService.getAllBills(workspaceId, currentUser, pageable);

        return ResponseEntity.ok(bills);
    }

}