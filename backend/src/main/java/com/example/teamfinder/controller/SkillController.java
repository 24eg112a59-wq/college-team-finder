package com.example.teamfinder.controller;

import com.example.teamfinder.dto.AddSkillRequest;
import com.example.teamfinder.dto.UserDTO;
import com.example.teamfinder.entity.Skill;
import com.example.teamfinder.service.SkillService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping("/skills")
    public ResponseEntity<List<Skill>> getAllSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }

    @PostMapping("/skills")
    public ResponseEntity<Skill> createSkill(@RequestBody Skill skill) {
        return new ResponseEntity<>(skillService.createSkill(skill.getName()), HttpStatus.CREATED);
    }

    @PostMapping("/users/{id}/skills")
    public ResponseEntity<UserDTO> addSkillToUser(@PathVariable Long id, @RequestBody AddSkillRequest request, Authentication authentication) {
        if (request.getSkillId() == null) {
            throw new IllegalArgumentException("Skill id is required");
        }
        return ResponseEntity.ok(skillService.addSkillToUser(id, request.getSkillId(), authentication.getName()));
    }

    @DeleteMapping("/users/{id}/skills/{skillId}")
    public ResponseEntity<UserDTO> removeSkillFromUser(@PathVariable Long id, @PathVariable Long skillId, Authentication authentication) {
        return ResponseEntity.ok(skillService.removeSkillFromUser(id, skillId, authentication.getName()));
    }
}
