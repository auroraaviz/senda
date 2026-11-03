package com.example.demo.service;

import com.example.demo.exception.NotFoundException;
import com.example.demo.model.Phase;
import com.example.demo.model.Project;
import com.example.demo.repository.PhaseRepository;
import com.example.demo.repository.ProjectRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PhaseServiceIsolationTest {

    @Mock
    private PhaseRepository phaseRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private PhaseService phaseService;

    // ---------- ayudas ----------

    private Phase newPhase(int progress) {
        return Phase.builder()
                .name("Fase")
                .orderNumber(1)
                .progress(progress)
                .weight(1)
                .build();
    }

    // ---------- el proyecto no es del usuario ----------

    @Test
    void createPhase_proyectoDeOtroUsuario_lanzaNotFoundYNoGuarda() {
        when(projectRepository.findByIdAndUserUsername(1L, "intruso")).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class,
                () -> phaseService.createPhase(1L, newPhase(0), "intruso"));

        verify(phaseRepository, never()).save(any(Phase.class));
    }

    @Test
    void updatePhase_proyectoDeOtroUsuario_lanzaNotFoundYNoGuarda() {
        when(projectRepository.findByIdAndUserUsername(1L, "intruso")).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class,
                () -> phaseService.updatePhase(1L, 5L, newPhase(50), "intruso"));

        verify(phaseRepository, never()).save(any(Phase.class));
    }

    // ---------- el proyecto es del usuario, pero la fase es de otro proyecto ----------

    @Test
    void updatePhase_faseDeOtroProyecto_lanzaNotFoundYNoGuarda() {
        Project miProyecto = Project.builder().id(1L).build();
        Project proyectoAjeno = Project.builder().id(2L).build();
        Phase faseAjena = Phase.builder().id(99L).name("Ajena").project(proyectoAjeno).build();

        when(projectRepository.findByIdAndUserUsername(1L, "ana")).thenReturn(Optional.of(miProyecto));
        when(phaseRepository.findById(99L)).thenReturn(Optional.of(faseAjena));

        // PUT /projects/1/phases/99 -> el proyecto 1 es de ana, pero la fase 99 no es de ese proyecto
        assertThrows(NotFoundException.class,
                () -> phaseService.updatePhase(1L, 99L, newPhase(50), "ana"));

        verify(phaseRepository, never()).save(any(Phase.class));
    }

    @Test
    void deletePhase_faseDeOtroProyecto_lanzaNotFoundYNoBorra() {
        Project miProyecto = Project.builder().id(1L).build();
        Project proyectoAjeno = Project.builder().id(2L).build();
        Phase faseAjena = Phase.builder().id(99L).name("Ajena").project(proyectoAjeno).build();

        when(projectRepository.findByIdAndUserUsername(1L, "ana")).thenReturn(Optional.of(miProyecto));
        when(phaseRepository.findById(99L)).thenReturn(Optional.of(faseAjena));

        assertThrows(NotFoundException.class,
                () -> phaseService.deletePhase(1L, 99L, "ana"));

        verify(phaseRepository, never()).delete(any(Phase.class));
    }

    // ---------- caso correcto ----------

    @Test
    void updatePhase_faseDelUsuario_guardaYRecalculaElProgresoDelProyecto() {
        Project proyecto = Project.builder().id(1L).build();
        Phase existente = Phase.builder()
                .id(5L).name("Antes").orderNumber(1).progress(0).weight(1)
                .project(proyecto)
                .build();

        when(projectRepository.findByIdAndUserUsername(1L, "ana")).thenReturn(Optional.of(proyecto));
        when(phaseRepository.findById(5L)).thenReturn(Optional.of(existente));
        when(phaseRepository.save(any(Phase.class))).thenAnswer(inv -> inv.getArgument(0));

        Phase resultado = phaseService.updatePhase(1L, 5L, newPhase(60), "ana");

        assertEquals(60, resultado.getProgress());
        verify(projectService).updateProjectProgress(proyecto);
    }
}