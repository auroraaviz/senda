package com.example.demo.mapper;

import com.example.demo.dto.PhaseDTO;
import com.example.demo.dto.ProjectDTO;
import com.example.demo.model.Phase;
import com.example.demo.model.Project;

import java.util.stream.Collectors;

public class ProjectMapper {

    public static ProjectDTO toDTO(Project project) {
    return ProjectDTO.builder()
            .id(project.getId())
            .title(project.getTitle())
            .size(project.getSize().name())
            .startDate(project.getStartDate())
            .endDate(project.getEndDate())
            .progress(project.getProgress())
            .phases(
                    project.getPhases() == null ? null :
                    project.getPhases().stream()
    .map(ProjectMapper::toPhaseDTO)
    .collect(Collectors.toList())
    )
            .build();
    }

    public static PhaseDTO toPhaseDTO(Phase phase) {

        return PhaseDTO.builder()
                .id(phase.getId())
                .name(phase.getName())
                .orderNumber(phase.getOrderNumber())
                .progress(phase.getProgress())
                .weight(phase.getWeight())
                .dueDate(phase.getDueDate())
                .build();
    }

}
