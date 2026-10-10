package com.example.teamfinder.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Set;

public record ProjectCreateRequest(
    @NotBlank String title,
    String description,
    String category,
    String status,
    @NotNull Integer maxTeamSize,
    @NotNull Long ownerId,
    @Size(min = 1) Set<String> requiredSkills
) {
}
