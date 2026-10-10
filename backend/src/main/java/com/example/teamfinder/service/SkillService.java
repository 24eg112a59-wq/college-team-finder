package com.example.teamfinder.service;

import com.example.teamfinder.dto.UserDTO;
import com.example.teamfinder.entity.Skill;
import com.example.teamfinder.entity.User;
import com.example.teamfinder.repository.SkillRepository;
import com.example.teamfinder.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    public SkillService(SkillRepository skillRepository, UserRepository userRepository) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    @Transactional
    public Skill createSkill(String name) {
        return skillRepository.findByName(name)
            .orElseGet(() -> skillRepository.save(new Skill(name)));
    }

    @Transactional
    public UserDTO addSkillToUser(Long userId, Long skillId, String authenticatedEmail) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        requireOwner(user, authenticatedEmail);
        Skill skill = skillRepository.findById(skillId)
            .orElseThrow(() -> new IllegalArgumentException("Skill not found"));

        user.getSkills().add(skill);
        return UserDTO.from(userRepository.save(user));
    }

    @Transactional
    public UserDTO removeSkillFromUser(Long userId, Long skillId, String authenticatedEmail) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        requireOwner(user, authenticatedEmail);
        Skill skill = skillRepository.findById(skillId)
            .orElseThrow(() -> new IllegalArgumentException("Skill not found"));

        user.getSkills().remove(skill);
        return UserDTO.from(userRepository.save(user));
    }

    private void requireOwner(User user, String authenticatedEmail) {
        if (!user.getEmail().equals(authenticatedEmail)) {
            throw new IllegalArgumentException("You can only change your own skills");
        }
    }
}
