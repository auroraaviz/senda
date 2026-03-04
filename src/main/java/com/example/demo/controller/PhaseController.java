package com.example.demo.controller;

import com.example.demo.dto.PhaseDTO;
import com.example.demo.mapper.ProjectMapper;
import com.example.demo.model.Phase;
import com.example.demo.service.PhaseService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/projects/{projectId}/phases")
public class PhaseController {

    private final PhaseService phaseService;

    @PostMapping
    public PhaseDTO createPhase(
            @PathVariable Long projectId,
            @Valid @RequestBody PhaseDTO dto) {

        Phase phase = Phase.builder()
                .name(dto.getName())
                .orderNumber(dto.getOrderNumber())
                .progress(dto.getProgress())
                .weight(dto.getWeight())
                .dueDate(dto.getDueDate())
                .build();

        Phase saved = phaseService.createPhase(projectId, phase);

        return ProjectMapper.toPhaseDTO(saved);
    }

    @GetMapping
    public List<PhaseDTO> getPhases(@PathVariable Long projectId) {

        return phaseService.getPhasesByProject(projectId)
                .stream()
                .map(ProjectMapper::toPhaseDTO)
                .toList();
    }


    @PutMapping("/{phaseId}")
    public PhaseDTO updatePhase(@PathVariable Long projectId,
                                @PathVariable Long phaseId,
                                @Valid @RequestBody PhaseDTO dto) {

        Phase phase = Phase.builder()
                .name(dto.getName())
                .orderNumber(dto.getOrderNumber())
                .progress(dto.getProgress())
                .weight(dto.getWeight())
                .dueDate(dto.getDueDate())
                .build();

        Phase updated = phaseService.updatePhase(projectId, phaseId, phase);

        return ProjectMapper.toPhaseDTO(updated);
    }

    @DeleteMapping("/{phaseId}")
    public void deletePhase(@PathVariable Long projectId,
                            @PathVariable Long phaseId) {
        phaseService.deletePhase(projectId, phaseId);
    }
}

