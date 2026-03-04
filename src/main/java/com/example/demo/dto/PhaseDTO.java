package com.example.demo.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhaseDTO {
    private Long id;
    private String name;
    private int orderNumber;
    private int progress;
    private int weight;
    private LocalDate dueDate;
}

