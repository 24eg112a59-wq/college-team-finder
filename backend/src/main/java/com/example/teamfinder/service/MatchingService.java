package com.example.teamfinder.service;

import com.example.teamfinder.entity.Project;
import com.example.teamfinder.entity.Skill;
import com.example.teamfinder.entity.User;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    public int calculateMatchPercentage(Project project, User student) {
        if (project == null || project.getRequiredSkills() == null || project.getRequiredSkills().isEmpty()) {
            return 0;
        }

        return (int) Math.round((getMatchingSkills(project, student).size() * 100.0) / project.getRequiredSkills().size());
    }

    public Set<String> getMatchingSkills(Project project, User student) {
        if (project == null || project.getRequiredSkills() == null || project.getRequiredSkills().isEmpty()) {
            return Set.of();
        }
        Set<String> studentSkills = student.getSkills().stream()
            .map(skill -> skill.getName().toLowerCase())
            .collect(Collectors.toSet());
        Set<String> matching = new HashSet<>();
        for (Skill required : project.getRequiredSkills()) {
            if (studentSkills.contains(required.getName().toLowerCase())) {
                matching.add(required.getName());
            }
        }
        return matching;
    }
}
