package com.example.teamfinder.service;

import com.example.teamfinder.dto.UserDTO;
import com.example.teamfinder.entity.User;
import com.example.teamfinder.entity.Role;
import com.example.teamfinder.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(UserDTO::from).toList();
    }

    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        return UserDTO.from(findUser(id));
    }

    @Transactional(readOnly = true)
    public List<UserDTO> searchUsers(String name, String skill, String branch, Integer year) {
        return userRepository.findAll().stream()
            .filter(user -> user.getRole() == Role.STUDENT)
            .filter(user -> name == null || name.isBlank() || user.getName().toLowerCase().contains(name.trim().toLowerCase()))
            .filter(user -> branch == null || branch.isBlank() || branch.equalsIgnoreCase(user.getBranch()))
            .filter(user -> year == null || year.equals(user.getYear()))
            .filter(user -> skill == null || skill.isBlank() || user.getSkills().stream()
                .anyMatch(userSkill -> userSkill.getName().equalsIgnoreCase(skill.trim())))
            .map(UserDTO::from)
            .toList();
    }

    @Transactional
    public UserDTO updateUser(Long id, User updatedUser) {
        User existing = findUser(id);
        existing.setName(updatedUser.getName());
        existing.setBranch(updatedUser.getBranch());
        existing.setYear(updatedUser.getYear());
        existing.setPhone(updatedUser.getPhone());
        existing.setBio(updatedUser.getBio());
        existing.setCollegeId(updatedUser.getCollegeId());
        return UserDTO.from(userRepository.save(existing));
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.delete(findUser(id));
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
    }
}
