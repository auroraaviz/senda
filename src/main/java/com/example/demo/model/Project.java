package com.example.demo.model;

import com.example.demo.dto.PhaseDTO;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder

public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotNull
    @Enumerated(EnumType.STRING)
    private ProjectSize size;

    private LocalDate startDate;
    private LocalDate endDate;

    @Min(0)
    @Max(100)
    private int progress;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Phase> phases;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status;
}
