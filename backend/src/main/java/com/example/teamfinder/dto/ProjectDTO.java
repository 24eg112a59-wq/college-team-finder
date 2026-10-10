package com.example.teamfinder.dto;

import com.example.teamfinder.entity.Project;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public record ProjectDTO(Long id, String title, String description, String category, String status,
                         Integer maxTeamSize, Long ownerId, String ownerName, Set<String> requiredSkills,
                         List<UserDTO> teamMembers, int teamSize, LocalDateTime createdAt, Integer matchPercentage) {
    public static ProjectDTO from(Project project) {
        return from(project, null);
    }

    public static ProjectDTO from(Project project, Integer matchPercentage) {
        List<UserDTO> members = project.getTeamMembers().stream().map(UserDTO::from).toList();
        return new ProjectDTO(project.getId(), project.getTitle(), project.getDescription(), project.getCategory(),
            project.getStatus(), project.getMaxTeamSize(), project.getOwner().getId(), project.getOwner().getName(),
            project.getRequiredSkills().stream().map(skill -> skill.getName()).collect(Collectors.toSet()),
            members, members.size() + 1, project.getCreatedAt(), matchPercentage);
    }
}
