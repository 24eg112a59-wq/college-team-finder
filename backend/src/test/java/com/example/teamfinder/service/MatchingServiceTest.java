package com.example.teamfinder.service;

import com.example.teamfinder.entity.Project;
import com.example.teamfinder.entity.Skill;
import com.example.teamfinder.entity.User;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;

class MatchingServiceTest {

    private final MatchingService matchingService = new MatchingService();

    @Test
    void calculatesCaseInsensitiveSkillMatch() {
        Project project = new Project();
        project.setRequiredSkills(Set.of(new Skill("Java"), new Skill("React"), new Skill("MySQL"), new Skill("Spring Boot")));

        User student = new User();
        student.setSkills(Set.of(new Skill("JAVA"), new Skill("React"), new Skill("MySQL"), new Skill("Python")));

        assertEquals(75, matchingService.calculateMatchPercentage(project, student));
        assertEquals(Set.of("Java", "React", "MySQL"), matchingService.getMatchingSkills(project, student));
    }

    @Test
    void returnsZeroWhenProjectHasNoRequiredSkills() {
        Project project = new Project();
        project.setRequiredSkills(Set.of());

        assertEquals(0, matchingService.calculateMatchPercentage(project, new User()));
    }
}
