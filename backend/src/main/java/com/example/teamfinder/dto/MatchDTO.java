package com.example.teamfinder.dto;

import java.util.Set;

public record MatchDTO(UserDTO student, int matchPercentage, Set<String> matchingSkills) {
}
