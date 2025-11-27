package com.billparser.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bills")
@Data
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "reference_month")
    private String referenceMonth;

    @Column(name = "peak_consumption_kwh")
    private Double peakConsumptionKwh;

    @Column(name = "off_peak_consumption_kwh")
    private Double offPeakConsumptionKwh;

    @Column(name = "billing_days")
    private Integer billingDays;

    @Column(name = "tariff_flag")
    private String tariffFlag;

    @Column(name = "client_data")
    private String clientData;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @Embedded
    private ContractedDemand contractedDemand;

    @Embedded
    private ReadingDates readingDates;

    @Embedded
    private MeteringEquipment meteringEquipment;

    @Embedded
    private VoltageLevels voltageLevels;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BillItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BillTax> taxes = new ArrayList<>();

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BillTariff> tariffs = new ArrayList<>();

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BillMeterReading> meterReadings = new ArrayList<>();

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BillHistory> history = new ArrayList<>();

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BillContinuityIndicator> indicators = new ArrayList<>();
}