package com.example.teamfinder.service;

import com.example.teamfinder.dto.ProjectDTO;
import com.example.teamfinder.dto.TeamRequestDTO;
import com.example.teamfinder.dto.UserDTO;
import com.example.teamfinder.entity.TeamRequest;
import com.example.teamfinder.repository.ProjectRepository;
import com.example.teamfinder.repository.SkillRepository;
import com.example.teamfinder.repository.TeamRequestRepository;
import com.example.teamfinder.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TeamRequestRepository teamRequestRepository;
    private final SkillRepository skillRepository;

    public AdminService(UserRepository userRepository, ProjectRepository projectRepository,
                        TeamRequestRepository teamRequestRepository, SkillRepository skillRepository) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.teamRequestRepository = teamRequestRepository;
        this.skillRepository = skillRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getSystemStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalStudents", userRepository.findAll().stream().filter(user -> user.getRole() != null && user.getRole().name().equals("STUDENT")).count());
        stats.put("totalProjects", projectRepository.count());
        stats.put("totalSkills", skillRepository.count());
        stats.put("pendingRequests", teamRequestRepository.findAll().stream().filter(request -> request.getStatus() == TeamRequest.RequestStatus.PENDING).count());
        return stats;
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getAllStudents() {
        return userRepository.findAll().stream().filter(user -> user.getRole().name().equals("STUDENT"))
            .map(UserDTO::from).toList();
    }

    @Transactional(readOnly = true)
    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll().stream().map(ProjectDTO::from).toList();
    }

    @Transactional(readOnly = true)
    public List<TeamRequestDTO> getAllRequests() {
        return teamRequestRepository.findAll().stream().map(TeamRequestDTO::from).toList();
    }
}
