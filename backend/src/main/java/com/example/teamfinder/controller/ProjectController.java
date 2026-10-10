package com.example.teamfinder.controller;

import com.example.teamfinder.entity.Project;
import com.example.teamfinder.dto.MatchDTO;
import com.example.teamfinder.dto.ProjectCreateRequest;
import com.example.teamfinder.dto.ProjectDTO;
import com.example.teamfinder.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/projects")
    public ResponseEntity<List<ProjectDTO>> getAllProjects(@RequestParam(required = false) String skill) {
        return ResponseEntity.ok(projectService.getAllProjects(skill));
    }

    @GetMapping("/projects/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping("/projects")
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody ProjectCreateRequest request, Authentication authentication) {
        return new ResponseEntity<>(projectService.createProject(request, authentication.getName()), HttpStatus.CREATED);
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id, @RequestBody Project project, Authentication authentication) {
        return ResponseEntity.ok(projectService.updateProject(id, project, authentication.getName()));
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id, Authentication authentication) {
        projectService.deleteProject(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/projects/{projectId}/matches")
    public ResponseEntity<List<MatchDTO>> getProjectMatches(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.getMatches(projectId));
    }
}
