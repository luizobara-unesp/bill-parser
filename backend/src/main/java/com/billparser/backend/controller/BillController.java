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

@RestController
@RequestMapping("/api/v1/bills")
@RequiredArgsConstructor
public class BillController {

    private final BillService billService;

    @PostMapping("/upload")
    public ResponseEntity<Bill> uploadBill(
            @RequestParam("file") MultipartFile file,
            @RequestParam("workspaceId") Long workspaceId
    ) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Bill savedBill = billService.processAndSaveBill(file, workspaceId, currentUser);
        return ResponseEntity.ok(savedBill);
    }
}