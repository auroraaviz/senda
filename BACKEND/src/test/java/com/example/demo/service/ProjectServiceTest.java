package com.example.demo.service;
 
import com.example.demo.exception.NotFoundException;
import com.example.demo.model.Phase;
import com.example.demo.model.Project;
import com.example.demo.model.ProjectStatus;
import com.example.demo.model.User;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
 
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;
 
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private ProjectService projectService;

    private Phase phase(int progress, int weight, LocalDate dueDate) {
        return Phase.builder()
                .name("Fase")
                .orderNumber(1)
                .progress(progress)
                .weight(weight)
                .dueDate(dueDate)
                .build();
    }

    private Project projectWith(Phase... phases) {
        return Project.builder()
                .title("Proyecto de prueba")
                .phases(new ArrayList<>(Arrays.asList(phases)))
                .build();
    }

    //progreso ponderado
    @Test
    void updateProjectProgress_sinFases_progresoCeroYPlanificado() {
        Project project = projectWith();

        projectService.updateProjectProgress(project);

        assertEquals(0, project.getProgress());
        assertEquals(ProjectStatus.PLANNED, project.getStatus());
        verify(projectRepository).save(project);
    }     

    @Test
    void updateProjectProgress_listaDeFasesNula_progresoCeroYPlanificado() {
        Project project = Project.builder().title("Sin lista de fases").build();

        projectService.updateProjectProgress(project);

        assertEquals(0, project.getProgress());
        assertEquals(ProjectStatus.PLANNED, project.getStatus());
    }

    @Test
    void updateProjectProgress_unaFase_elProgresoEsElDeLaFase() {
        Project project = projectWith(phase(40, 5, null));

        projectService.updateProjectProgress(project);

        assertEquals(40, project.getProgress());
        assertEquals(ProjectStatus.IN_PROGRESS, project.getStatus());
    }

     @Test
    void updateProjectProgress_variasFasesConPesosDistintos_pesaCadaFase() {
        // (100*1 + 0*3) / 4 = 25. Una media simple daria 50
        Project project = projectWith(
                phase(100, 1, null),
                phase(0, 3, null));
 
        projectService.updateProjectProgress(project);
 
        assertEquals(25, project.getProgress());
        assertEquals(ProjectStatus.IN_PROGRESS, project.getStatus());
    }
 
    @Test
    void updateProjectProgress_redondeaHaciaAbajo_nuncaMarcaCompletadoSinTerminar() {
        // (100 + 100 + 99) / 3 = 99,67 -> 99 por la division entera
        Project project = projectWith(
                phase(100, 1, null),
                phase(100, 1, null),
                phase(99, 1, null));
 
        projectService.updateProjectProgress(project);
 
        assertEquals(99, project.getProgress());
        assertEquals(ProjectStatus.IN_PROGRESS, project.getStatus());
    }
 
    @Test
    void updateProjectProgress_pesoTotalCero_progresoCeroSinDividirPorCero() {
        // la validacion @Min(1) lo impide en la API, pero la rama defensiva existe
        Project project = projectWith(phase(80, 0, null));
 
        projectService.updateProjectProgress(project);
 
        assertEquals(0, project.getProgress());
        assertEquals(ProjectStatus.PLANNED, project.getStatus());
    }
 
    // ---------- estado del proyecto ----------
 
    @Test
    void updateProjectProgress_todasLasFasesAl100_completado() {
        Project project = projectWith(
                phase(100, 2, null),
                phase(100, 3, null));
 
        projectService.updateProjectProgress(project);
 
        assertEquals(100, project.getProgress());
        assertEquals(ProjectStatus.COMPLETED, project.getStatus());
    }
 
    @Test
    void updateProjectProgress_unaFaseRetrasada_proyectoRetrasado() {
        Project project = projectWith(
                phase(50, 1, LocalDate.now().minusDays(1)),
                phase(100, 1, null));
 
        projectService.updateProjectProgress(project);
 
        assertEquals(75, project.getProgress());
        assertEquals(ProjectStatus.DELAYED, project.getStatus());
    }
 
    @Test
    void updateProjectProgress_retrasoTienePrioridadSobreElProgreso() {
        // 91% de progreso, pero una fase vencida sin terminar
        Project project = projectWith(
                phase(90, 9, LocalDate.now().minusDays(1)),
                phase(100, 1, null));
 
        projectService.updateProjectProgress(project);
 
        assertEquals(91, project.getProgress());
        assertEquals(ProjectStatus.DELAYED, project.getStatus());
    }
 
    @Test
    void updateProjectProgress_faseVencidaPeroCompletada_noRetrasa() {
        Project project = projectWith(phase(100, 1, LocalDate.now().minusDays(10)));
 
        projectService.updateProjectProgress(project);
 
        assertEquals(ProjectStatus.COMPLETED, project.getStatus());
    }
 
    // ---------- aislamiento de datos por usuario ----------
 
    @Test
    void createProject_asignaElUsuarioAutenticadoComoDueno() {
        User user = mock(User.class);
        Project project = Project.builder().title("Tesis").build();
        when(userRepository.findByUsername("ana")).thenReturn(Optional.of(user));
        when(projectRepository.save(any(Project.class))).thenAnswer(inv -> inv.getArgument(0));
 
        Project saved = projectService.createProject(project, "ana");
 
        assertSame(user, saved.getUser());
    }
 
    @Test
    void createProject_usuarioInexistente_lanzaNotFoundYNoGuarda() {
        Project project = Project.builder().title("Tesis").build();
        when(userRepository.findByUsername("nadie")).thenReturn(Optional.empty());
 
        assertThrows(NotFoundException.class,
                () -> projectService.createProject(project, "nadie"));
 
        verify(projectRepository, never()).save(any(Project.class));
    }
 
    @Test
    void getProjectById_proyectoDelUsuario_lodevuelve() {
        Project project = Project.builder().title("Mio").build();
        when(projectRepository.findByIdAndUserUsername(7L, "ana")).thenReturn(Optional.of(project));
 
        Project found = projectService.getProjectById(7L, "ana");
 
        assertSame(project, found);
    }
 
    @Test
    void getProjectById_proyectoDeOtroUsuario_lanzaNotFound() {
        // el repositorio filtra por id Y usuario: un intruso no encuentra nada
        when(projectRepository.findByIdAndUserUsername(7L, "intruso")).thenReturn(Optional.empty());
 
        assertThrows(NotFoundException.class,
                () -> projectService.getProjectById(7L, "intruso"));
    }
}