package com.example.demo.service;

import com.example.demo.model.Project;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.PhaseRepository;
import com.example.demo.model.Phase;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;
import com.example.demo.exception.NotFoundException;

@RequiredArgsConstructor
@Service
public class PhaseService {

    private final PhaseRepository phaseRepository;
    private final ProjectRepository projectRepository;
    private final ProjectService projectService;

    public Phase createPhase(Long projectId, Phase phase) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Project not found"));

        phase.setProject(project);
        Phase savedPhase = phaseRepository.save(phase);

        projectService.updateProjectProgress(project);

        return savedPhase;
    }

    public List<Phase> getPhasesByProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return project.getPhases();
    }


    public Phase updatePhase(Long projectId, Long phaseId, Phase updatedPhase) {

        Phase existingPhase = phaseRepository.findById(phaseId)
                .orElseThrow(() -> new RuntimeException("Phase not found"));

        if (!existingPhase.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Phase does not belong to this project");
        }

        existingPhase.setName(updatedPhase.getName());
        existingPhase.setOrderNumber(updatedPhase.getOrderNumber());
        existingPhase.setProgress(updatedPhase.getProgress());

        Phase savedPhase = phaseRepository.save(existingPhase);

        projectService.updateProjectProgress(existingPhase.getProject());

        return savedPhase;
    }

    public void deletePhase(Long projectId, Long phaseId) {

        Phase existingPhase = phaseRepository.findById(phaseId)
                .orElseThrow(() -> new NotFoundException("Phase not found"));

        if (!existingPhase.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Phase does not belong to this project");
        }

        Project project = existingPhase.getProject();

        phaseRepository.delete(existingPhase);

        projectService.updateProjectProgress(project);
    }
}