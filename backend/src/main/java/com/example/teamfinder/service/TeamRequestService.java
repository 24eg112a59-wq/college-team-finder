package com.example.teamfinder.service;

import com.example.teamfinder.dto.TeamRequestDTO;
import com.example.teamfinder.entity.Project;
import com.example.teamfinder.entity.Role;
import com.example.teamfinder.entity.TeamRequest;
import com.example.teamfinder.entity.User;
import com.example.teamfinder.repository.ProjectRepository;
import com.example.teamfinder.repository.TeamRequestRepository;
import com.example.teamfinder.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class TeamRequestService {

    private final TeamRequestRepository teamRequestRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public TeamRequestService(TeamRequestRepository teamRequestRepository, UserRepository userRepository, ProjectRepository projectRepository) {
        this.teamRequestRepository = teamRequestRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }

    @Transactional
    public TeamRequestDTO createRequest(Long projectId, Long senderId, Long receiverId, String authenticatedEmail) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        User sender = userRepository.findById(senderId)
            .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
            .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

        if (senderId.equals(receiverId)) {
            throw new IllegalArgumentException("You cannot invite yourself");
        }
        if (!project.getOwner().getId().equals(senderId)) {
            throw new IllegalArgumentException("Only the project owner can invite teammates");
        }
        if (!sender.getEmail().equals(authenticatedEmail)) {
            throw new IllegalArgumentException("Invitation sender must be the signed-in account");
        }
        if (project.getTeamMembers().stream().anyMatch(member -> member.getId().equals(receiverId))) {
            throw new IllegalArgumentException("Student is already a project member");
        }
        if (teamRequestRepository.existsByProject_IdAndReceiver_IdAndStatusIn(projectId, receiverId,
            List.of(TeamRequest.RequestStatus.PENDING, TeamRequest.RequestStatus.ACCEPTED))) {
            throw new IllegalArgumentException("An active invitation already exists for this student and project");
        }
        if (project.getTeamMembers().size() + 1 >= project.getMaxTeamSize()) {
            throw new IllegalArgumentException("Project team is full");
        }

        TeamRequest request = new TeamRequest();
        request.setProject(project);
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setStatus(TeamRequest.RequestStatus.PENDING);
        return TeamRequestDTO.from(teamRequestRepository.save(request));
    }

    @Transactional(readOnly = true)
    public List<TeamRequestDTO> getReceivedRequests(Long userId, String authenticatedEmail) {
        verifyAccount(userId, authenticatedEmail);
        return teamRequestRepository.findByReceiver_IdOrderByCreatedAtDesc(userId).stream()
            .map(TeamRequestDTO::from).toList();
    }

    @Transactional(readOnly = true)
    public List<TeamRequestDTO> getSentRequests(Long userId, String authenticatedEmail) {
        verifyAccount(userId, authenticatedEmail);
        return teamRequestRepository.findBySender_IdOrderByCreatedAtDesc(userId).stream()
            .map(TeamRequestDTO::from).toList();
    }

    @Transactional
    public TeamRequestDTO acceptRequest(Long requestId, String authenticatedEmail) {
        TeamRequest request = findRequest(requestId);
        if (!request.getReceiver().getEmail().equals(authenticatedEmail)) {
            throw new IllegalArgumentException("Only the invited student can accept this invitation");
        }
        if (request.getStatus() != TeamRequest.RequestStatus.PENDING) {
            throw new IllegalArgumentException("Only pending invitations can be accepted");
        }
        Project project = projectRepository.findByIdForUpdate(request.getProject().getId())
            .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        if (project.getTeamMembers().size() + 2 > project.getMaxTeamSize()) {
            throw new IllegalArgumentException("Project team is full");
        }
        if (project.getTeamMembers().stream().anyMatch(member -> member.getId().equals(request.getReceiver().getId()))) {
            throw new IllegalArgumentException("Student is already a project member");
        }
        project.getTeamMembers().add(request.getReceiver());
        projectRepository.save(project);
        request.setStatus(TeamRequest.RequestStatus.ACCEPTED);
        return TeamRequestDTO.from(teamRequestRepository.save(request));
    }

    @Transactional
    public TeamRequestDTO rejectRequest(Long requestId, String authenticatedEmail) {
        TeamRequest request = findRequest(requestId);
        if (!request.getReceiver().getEmail().equals(authenticatedEmail)) {
            throw new IllegalArgumentException("Only the invited student can reject this invitation");
        }
        if (request.getStatus() != TeamRequest.RequestStatus.PENDING) {
            throw new IllegalArgumentException("Only pending invitations can be rejected");
        }
        request.setStatus(TeamRequest.RequestStatus.REJECTED);
        return TeamRequestDTO.from(teamRequestRepository.save(request));
    }

    private TeamRequest findRequest(Long requestId) {
        return teamRequestRepository.findById(requestId)
            .orElseThrow(() -> new IllegalArgumentException("Request not found"));
    }

    private void verifyAccount(Long userId, String authenticatedEmail) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!user.getEmail().equals(authenticatedEmail)) {
            throw new IllegalArgumentException("You can only view your own invitations");
        }
    }
}
