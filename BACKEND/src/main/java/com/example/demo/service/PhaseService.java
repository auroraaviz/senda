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

    private Project getOwnedProject(Long projectId, String username) {
        return projectRepository.findByIdAndUserUsername(projectId, username)
            .orElseThrow(() -> new NotFoundException("Project not found"));
    }

        private Phase getOwnedPhase(Long projectId, Long phaseId, String username) {
            getOwnedProject(projectId, username); // valida que el proyecto es del usuario

        Phase phase = phaseRepository.findById(phaseId) 
            .orElseThrow(() -> new NotFoundException("Phase not found"));

        if (!phase.getProject().getId().equals(projectId)) {
            throw new NotFoundException("Phase not found");
        }
        return phase;
        }

    public Phase createPhase(Long projectId, Phase phase, String username) {
        Project project = getOwnedProject(projectId, username);

        phase.setProject(project);
        Phase savedPhase = phaseRepository.save(phase);

        projectService.updateProjectProgress(project);

        return savedPhase;
    }

    public List<Phase> getPhasesByProject(Long projectId, String username) {
        return getOwnedProject(projectId, username).getPhases();
    }

    public Phase updatePhase(Long projectId, Long phaseId, Phase updatedPhase, String username) {

        Phase existingPhase = getOwnedPhase(projectId, phaseId, username);

        existingPhase.setName(updatedPhase.getName());
        existingPhase.setOrderNumber(updatedPhase.getOrderNumber());
        existingPhase.setProgress(updatedPhase.getProgress());
        existingPhase.setWeight(updatedPhase.getWeight());
        existingPhase.setDueDate(updatedPhase.getDueDate());

        Phase savedPhase = phaseRepository.save(existingPhase);

        projectService.updateProjectProgress(existingPhase.getProject());

        return savedPhase;
    }

    public void deletePhase(Long projectId, Long phaseId, String username) {

        Phase existingPhase = getOwnedPhase(projectId, phaseId, username);
        Project project = existingPhase.getProject();

        phaseRepository.delete(existingPhase);

        projectService.updateProjectProgress(project);
    }
}