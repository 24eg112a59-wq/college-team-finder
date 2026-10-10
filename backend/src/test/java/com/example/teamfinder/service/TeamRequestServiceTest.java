package com.example.teamfinder.service;

import com.example.teamfinder.entity.Project;
import com.example.teamfinder.entity.TeamRequest;
import com.example.teamfinder.entity.User;
import com.example.teamfinder.repository.ProjectRepository;
import com.example.teamfinder.repository.TeamRequestRepository;
import com.example.teamfinder.repository.UserRepository;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class TeamRequestServiceTest {

    @Test
    void acceptsTheLastAvailableTeamMemberSlot() {
        User owner = user(1L, "owner@example.edu");
        User candidate = user(2L, "candidate@example.edu");
        User nextCandidate = user(3L, "next@example.edu");
        Project project = new Project();
        project.setId(10L);
        project.setOwner(owner);
        project.setMaxTeamSize(2);
        project.setTeamMembers(new HashSet<>());

        TeamRequest request = new TeamRequest();
        request.setId(20L);
        request.setProject(project);
        request.setSender(owner);
        request.setReceiver(candidate);
        request.setStatus(TeamRequest.RequestStatus.PENDING);

        ProjectRepository projectRepository = mock(ProjectRepository.class);
        TeamRequestRepository requestRepository = mock(TeamRequestRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        when(userRepository.findById(1L)).thenReturn(Optional.of(owner));
        when(userRepository.findById(3L)).thenReturn(Optional.of(nextCandidate));
        when(requestRepository.findById(20L)).thenReturn(Optional.of(request));
        when(requestRepository.existsByProject_IdAndReceiver_IdAndStatusIn(any(), any(), any())).thenReturn(false);
        when(requestRepository.save(any(TeamRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(projectRepository.findByIdForUpdate(10L)).thenReturn(Optional.of(project));
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TeamRequestService service = new TeamRequestService(requestRepository, userRepository, projectRepository);
        var accepted = service.acceptRequest(20L, "candidate@example.edu");

        assertEquals("ACCEPTED", accepted.status());
        assertEquals(1, project.getTeamMembers().size());
        assertEquals(2, project.getTeamMembers().size() + 1);
        assertThrows(IllegalArgumentException.class,
            () -> service.createRequest(10L, 1L, 3L, "owner@example.edu"));
    }

    @Test
    void doesNotAllowAnotherStudentToAcceptAnInvitation() {
        User owner = user(1L, "owner@example.edu");
        User candidate = user(2L, "candidate@example.edu");
        Project project = new Project();
        project.setId(10L);
        project.setOwner(owner);
        project.setMaxTeamSize(3);
        project.setTeamMembers(new HashSet<>());

        TeamRequest request = new TeamRequest();
        request.setId(20L);
        request.setProject(project);
        request.setSender(owner);
        request.setReceiver(candidate);
        request.setStatus(TeamRequest.RequestStatus.PENDING);

        TeamRequestRepository requestRepository = mock(TeamRequestRepository.class);
        when(requestRepository.findById(20L)).thenReturn(Optional.of(request));
        TeamRequestService service = new TeamRequestService(requestRepository, mock(UserRepository.class), mock(ProjectRepository.class));

        assertThrows(IllegalArgumentException.class, () -> service.acceptRequest(20L, "intruder@example.edu"));
    }

    private User user(Long id, String email) {
        User user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setName(email);
        return user;
    }
}
