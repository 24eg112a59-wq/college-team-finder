package com.example.teamfinder.service;

import com.example.teamfinder.dto.MatchDTO;
import com.example.teamfinder.dto.ProjectCreateRequest;
import com.example.teamfinder.dto.ProjectDTO;
import com.example.teamfinder.dto.UserDTO;
import com.example.teamfinder.entity.Project;
import com.example.teamfinder.entity.Role;
import com.example.teamfinder.entity.Skill;
import com.example.teamfinder.entity.User;
import com.example.teamfinder.repository.ProjectRepository;
import com.example.teamfinder.repository.SkillRepository;
import com.example.teamfinder.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Locale;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final MatchingService matchingService;

    public ProjectService(ProjectRepository projectRepository, SkillRepository skillRepository, UserRepository userRepository,
                          MatchingService matchingService) {
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.matchingService = matchingService;
    }

    @Transactional(readOnly = true)
    public List<ProjectDTO> getAllProjects(String skill) {
        return projectRepository.findAll().stream()
            .filter(project -> skill == null || skill.isBlank() || project.getRequiredSkills().stream()
                .anyMatch(required -> required.getName().equalsIgnoreCase(skill.trim())))
            .map(ProjectDTO::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public ProjectDTO getProjectById(Long id) {
        return ProjectDTO.from(findProject(id));
    }

    @Transactional
    public ProjectDTO createProject(ProjectCreateRequest request, String authenticatedEmail) {
        User owner = userRepository.findById(request.ownerId())
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!owner.getEmail().equals(authenticatedEmail)) {
            throw new IllegalArgumentException("Project owner must be the signed-in account");
        }
        if (request.maxTeamSize() < 1) {
            throw new IllegalArgumentException("Maximum team size must be at least one");
        }

        Project project = new Project();
        project.setTitle(request.title());
        project.setDescription(request.description());
        project.setCategory(request.category());
        project.setStatus(request.status() == null || request.status().isBlank() ? "OPEN" : request.status());
        project.setMaxTeamSize(request.maxTeamSize());
        project.setOwner(owner);

        Set<Skill> skills = new HashSet<>();
        if (request.requiredSkills() != null) {
            for (String skillName : request.requiredSkills()) {
                String normalized = skillName.trim();
                if (!normalized.isEmpty()) {
                    Skill persisted = skillRepository.findByName(normalized)
                        .orElseGet(() -> skillRepository.save(new Skill(normalized)));
                    skills.add(persisted);
                }
            }
        }
        project.setRequiredSkills(skills);
        project.setTeamMembers(new HashSet<>());
        return ProjectDTO.from(projectRepository.save(project));
    }

    @Transactional
    public ProjectDTO updateProject(Long id, Project updatedProject, String authenticatedEmail) {
        Project existing = findProject(id);
        requireOwner(existing, authenticatedEmail);
        existing.setTitle(updatedProject.getTitle());
        existing.setDescription(updatedProject.getDescription());
        existing.setCategory(updatedProject.getCategory());
        existing.setStatus(updatedProject.getStatus());
        existing.setMaxTeamSize(updatedProject.getMaxTeamSize());
        return ProjectDTO.from(projectRepository.save(existing));
    }

    @Transactional
    public void deleteProject(Long id, String authenticatedEmail) {
        Project project = findProject(id);
        requireOwner(project, authenticatedEmail);
        projectRepository.delete(project);
    }

    @Transactional(readOnly = true)
    public List<MatchDTO> getMatches(Long projectId) {
        Project project = findProject(projectId);
        Set<Long> excludedIds = new HashSet<>();
        excludedIds.add(project.getOwner().getId());
        project.getTeamMembers().forEach(member -> excludedIds.add(member.getId()));

        return userRepository.findAll().stream()
            .filter(user -> user.getRole() == Role.STUDENT && !excludedIds.contains(user.getId()))
            .map(user -> {
                Set<String> matchedSkills = matchingService.getMatchingSkills(project, user);
                int percent = matchingService.calculateMatchPercentage(project, user);
                return new MatchDTO(UserDTO.from(user), percent, matchedSkills);
            })
            .filter(match -> !match.matchingSkills().isEmpty())
            .sorted((left, right) -> Integer.compare(right.matchPercentage(), left.matchPercentage()))
            .toList();
    }

    private Project findProject(Long id) {
        return projectRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Project not found with id: " + id));
    }

    private void requireOwner(Project project, String authenticatedEmail) {
        if (!project.getOwner().getEmail().equals(authenticatedEmail)) {
            throw new IllegalArgumentException("Only the project owner can change this project");
        }
    }
}
