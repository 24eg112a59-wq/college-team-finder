package com.example.teamfinder.dto;

import com.example.teamfinder.entity.User;
import java.util.Set;
import java.util.stream.Collectors;

public record UserDTO(Long id, String name, String email, String collegeId, String branch,
                      Integer year, String phone, String bio, String role, Set<String> skills) {
    public static UserDTO from(User user) {
        return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getCollegeId(),
            user.getBranch(), user.getYear(), user.getPhone(), user.getBio(), user.getRole().name(),
            user.getSkills().stream().map(skill -> skill.getName()).collect(Collectors.toSet()));
    }
}
