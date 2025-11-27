package com.billparser.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import java.time.LocalDate;

@Embeddable
@Data
public class ReadingDates {
    @Column(name = "previous_reading_date")
    private LocalDate previousReadingDate;

    @Column(name = "current_reading_date")
    private LocalDate currentReadingDate;

    @Column(name = "next_reading_date")
    private LocalDate nextReadingDate;

    @Column(name = "total_reading_days")
    private Integer totalDays;
}