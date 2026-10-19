package com.example.demo.controller;

import com.example.demo.dto.ProjectDTO;
import com.example.demo.mapper.ProjectMapper;
import com.example.demo.model.Project;
import com.example.demo.model.ProjectStatus;
import com.example.demo.service.ProjectService;
import com.example.demo.model.ProjectSize;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import lombok.RequiredArgsConstructor;
import com.example.demo.model.ProjectSize;
import java.util.List;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping("/{id}")
    public ProjectDTO getProjectById(@PathVariable Long id, Authentication authentication) {
        return ProjectMapper.toDTO(projectService.getProjectById(id, authentication.getName()));
    }

    @GetMapping
    public List<ProjectDTO> getAllProjects(Authentication authentication) {
        return projectService.getAllProjects(authentication.getName()).stream()
            .map(ProjectMapper::toDTO)
            .toList();
    }

    @PostMapping
    public ProjectDTO createProject(@Valid @RequestBody ProjectDTO projectDTO, Authentication authentication) {

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

        Project savedProject = projectService.createProject(project, authentication.getName());

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

    @PutMapping("/{id}")
    public ProjectDTO updateProject(@PathVariable Long id,
                                 @Valid @RequestBody ProjectDTO dto,
                                 Authentication authentication) {

        ProjectSize sizeEnum = ProjectSize.valueOf(dto.getSize().toUpperCase());

        Project updateProject = Project.builder()
                .title(dto.getTitle())
                .size(sizeEnum)
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .build();

        Project saved = projectService.updateProject(id, updateProject, authentication.getName());

        return ProjectMapper.toDTO(saved);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id, Authentication authentication) {
        projectService.deleteProject(id, authentication.getName());
    }
}

