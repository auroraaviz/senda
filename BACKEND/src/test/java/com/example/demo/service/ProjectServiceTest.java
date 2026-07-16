package com.example.demo.service;

import com.example.demo.model.Phase;
import com.example.demo.model.Project;
import com.example.demo.model.ProjectStatus;
import com.example.demo.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestClassOrder;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


public class ProjectServiceTest {

    private ProjectRepository projectRepository;
    private ProjectService projectService;

    @BeforeEach
    void setUp() {
        projectRepository = mock(ProjectRepository.class);
        when(projectRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        projectService = new ProjectService(projectRepository);
    }

    @Test
    void CalculateWeighted() {

        //GIVEN
        Phase phase1 = Phase.builder()
                .progress(50)
                .weight(50)
                .build();

        Phase phase2 = Phase.builder()
                .progress(100)
                .weight(50)
                .build();

        Project project = Project.builder()
                .phases(List.of(phase1, phase2))
                .build();

        //WHEN
        projectService.updateProjectProgress(project);

        //THEN
        assertEquals(75, project.getProgress());
    }

    @Test
    void  progressCero() {

        //GIVEN
        Project project = Project.builder()
                .phases(List.of())
                .build();

        //WHEN
        projectService.updateProjectProgress(project);

        //then
        assertEquals(0, project.getProgress());
        assertEquals(ProjectStatus.PLANNED, project.getStatus());
    }

    @Test
    void progress100() {

        //GIVEN
        Phase phase1 = Phase.builder()
                .progress(100)
                .weight(50)
                .build();

        Phase phase2 = Phase.builder()
                .progress(100)
                .weight(50)
                .build();

        Project project = Project.builder()
                .phases(List.of(phase1, phase2))
                .build();

        //WHEN
        projectService.updateProjectProgress(project);

        //THEN
        assertEquals(100, project.getProgress());
        assertEquals(ProjectStatus.COMPLETED, project.getStatus());
    }

    @Test
    void progressDue() {

        // GIVEN
        Phase phase1 = Phase.builder()
                .progress(50)
                .weight(100)
                .dueDate(LocalDate.now().minusDays(1)) // fecha pasada
                .build();

        Project project = Project.builder()
                .phases(List.of(phase1))
                .build();

        //WHEN
        projectService.updateProjectProgress(project);

        //THEN
        assertEquals(ProjectStatus.DELAYED, project.getStatus());
    }

    @Test
    void shouldThrowExceptionWhenProjectNotFound() {

        // GIVEN
        when(projectRepository.findById(99L)).thenReturn(java.util.Optional.empty());

        // WHEN + THEN
        assertThrows(RuntimeException.class, () -> {
            projectService.getProjectById(99L);
        });
    }
    }

