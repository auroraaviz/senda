package com.example.demo.controller;

import com.example.demo.dto.ProjectDTO;
import com.example.demo.mapper.ProjectMapper;
import com.example.demo.model.Project;
import com.example.demo.model.ProjectStatus;
import com.example.demo.service.ProjectService;
import com.example.demo.model.ProjectSize;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import com.example.demo.model.ProjectSize;
import java.util.List;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping("/{id}")
    public ProjectDTO getProjectById(@PathVariable Long id) {
        Project project = projectService.getProjectById(id);
        return ProjectMapper.toDTO(project);
    }

    @PostMapping
    public ProjectDTO createProject(@Valid @RequestBody ProjectDTO projectDTO) {

        ProjectSize sizeEnum;
        try {
            sizeEnum = ProjectSize.valueOf(projectDTO.getSize().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Tamaño inválido: " + projectDTO.getSize());
        }

        Project project = Project.builder()
                .title(projectDTO.getTitle())
                .size(sizeEnum)
                .startDate(projectDTO.getStartDate())
                .endDate(projectDTO.getEndDate())
                .progress(0)
                .status(ProjectStatus.PLANNED)
                .build();

        Project savedProject = projectService.createProject(project);

        return ProjectDTO.builder()
                .id(savedProject.getId())
                .title(savedProject.getTitle())
                .size(savedProject.getSize().name())
                .startDate(savedProject.getStartDate())
                .endDate(savedProject.getEndDate())
                .progress(savedProject.getProgress())
                .phases(null)
                .build();
    }

    private ProjectDTO mapToDTO(Project project) {
        return ProjectDTO.builder()
                .id(project.getId())
                .title(project.getTitle())
                .size(project.getSize().name())  // <-- CORREGIDO
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .progress(project.getProgress())
                .phases(null)
                .build();
    }

    @PostMapping("/demo")
    public Project demoProject() {
        Project project = new Project();
        project.setTitle("Proyecto Demo");
        project.setSize(ProjectSize.MEDIUM);
        return projectService.createProject(project);
    }

    @PutMapping("/{id}")
    public ProjectDTO updateProject(@PathVariable Long id,
                                 @Valid @RequestBody ProjectDTO dto) {

        ProjectSize sizeEnum = ProjectSize.valueOf(dto.getSize().toUpperCase());

        Project updateProject = Project.builder()
                .title(dto.getTitle())
                .size(sizeEnum)
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .build();

        Project saved = projectService.updateProject(id, updateProject);

        return ProjectMapper.toDTO(saved);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }
}

