package com.billparser.backend.dto.extractor;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class BillSavedResponse {
    private Long id;
    private BigDecimal valorTotalPagar;
    private String mesReferenciaGeral;
    private String statusMessage;
    private Long savedByUserId;
}
