package com.example.demo.service;

import com.example.demo.model.Project;
import com.example.demo.model.ProjectStatus;
import com.example.demo.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import com.example.demo.model.Phase;
import lombok.RequiredArgsConstructor;
import com.example.demo.exception.NotFoundException;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public Project createProject (Project project, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new NotFoundException("User not found"));
            project.setUser(user);
        return projectRepository.save(project);
    }

    public List <Project> getAllProjects(String username) {
        return projectRepository.findByUserUsername(username);
    }

    public Project getProjectById(Long id, String username) {
        return projectRepository.findByIdAndUserUsername (id, username)
            .orElseThrow(() -> new NotFoundException("Project not found"));
    }

    public Project updateProject(Long id, Project updatedProject, String username) {
        Project existingProject = getProjectById(id, username);

        existingProject.setTitle(updatedProject.getTitle());
        existingProject.setSize(updatedProject.getSize());
        existingProject.setStartDate(updatedProject.getStartDate());
        existingProject.setEndDate(updatedProject.getEndDate());

        return projectRepository.save(existingProject);
    }

    public void deleteProject(Long id, String username) {
        Project project = getProjectById(id, username);
        projectRepository.delete(project);
        }
        

    public void updateProjectProgress(Project project) {

        List<Phase> phases = project.getPhases();

        if (phases == null || phases.isEmpty()) {
            project.setProgress(0);
            updateProjectStatus(project);
            projectRepository.save(project);
            return;
        }

        int totalWeight = phases.stream()
                .mapToInt(Phase::getWeight)
                .sum();

        if (totalWeight == 0) {
            project.setProgress(0);
        } else {
            int weightedProgress = phases.stream()
                    .mapToInt(p -> p.getProgress() * p.getWeight())
                    .sum() / totalWeight;

            project.setProgress(weightedProgress);
        }

        updateProjectStatus(project);
        projectRepository.save(project);
    }

    private void updateProjectStatus(Project project) {

        boolean hasDelayedPhase = project.getPhases() != null &&
                project.getPhases().stream()
                        .anyMatch(Phase::isDelayed);

        if (hasDelayedPhase) {
            project.setStatus(ProjectStatus.DELAYED);
            return;
        }

        if(project.getProgress() == 0) {
            project.setStatus(ProjectStatus.PLANNED);
        } else if (project.getProgress() == 100) {
            project.setStatus(ProjectStatus.COMPLETED);
        } else {
            project.setStatus(ProjectStatus.IN_PROGRESS);
        }
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Project not found"));
    }
}