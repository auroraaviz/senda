package com.example.demo.service;

import com.example.demo.exception.NotFoundException;
import com.example.demo.model.Phase;
import com.example.demo.model.Project;
import com.example.demo.repository.PhaseRepository;
import com.example.demo.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class PhaseServiceTest {

    private PhaseRepository phaseRepository;
    private ProjectRepository projectRepository;
    private ProjectService projectService;
    private PhaseService phaseService;

    @BeforeEach
    void setUp() {
        // Mocks
        phaseRepository = mock(PhaseRepository.class);
        projectRepository = mock(ProjectRepository.class);
        projectService = mock(ProjectService.class);
        phaseService = new PhaseService(phaseRepository, projectRepository, projectService);


        when(phaseRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
    }

    @Test
    void creatingPhaseUpdatesProjectProgress() {

        // GIVEN
        Project project = Project.builder().phases(List.of()).build();
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));

        Phase phase = Phase.builder()
                .progress(50)
                .weight(100)
                .build();

        // WHEN
        Phase savedPhase = phaseService.createPhase(1L, phase);

        // THEN
        assertNotNull(savedPhase);
        assertEquals(phase, savedPhase);

        verify(projectService, times(1)).updateProjectProgress(project);
    }

    @Test
    void creatingPhaseInNonExistentProjectThrowsException() {
        // GIVEN
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());
        Phase phase = Phase.builder().build();

        // WHEN + THEN
        assertThrows(NotFoundException.class, () -> {
            phaseService.createPhase(99L, phase);
        });
    }
}