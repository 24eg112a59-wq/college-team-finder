package com.example.teamfinder.controller;

import com.example.teamfinder.entity.TeamRequest;
import com.example.teamfinder.dto.TeamRequestCreateRequest;
import com.example.teamfinder.dto.TeamRequestDTO;
import com.example.teamfinder.service.TeamRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TeamRequestController {

    private final TeamRequestService teamRequestService;

    public TeamRequestController(TeamRequestService teamRequestService) {
        this.teamRequestService = teamRequestService;
    }

    @PostMapping("/team-requests")
    public ResponseEntity<TeamRequestDTO> createRequest(@Valid @RequestBody TeamRequestCreateRequest request, Authentication authentication) {
        return new ResponseEntity<>(teamRequestService.createRequest(request.projectId(), request.senderId(), request.receiverId(), authentication.getName()), HttpStatus.CREATED);
    }

    @GetMapping("/team-requests/received")
    public ResponseEntity<List<TeamRequestDTO>> getReceived(@RequestParam Long userId, Authentication authentication) {
        return ResponseEntity.ok(teamRequestService.getReceivedRequests(userId, authentication.getName()));
    }

    @GetMapping("/team-requests/sent")
    public ResponseEntity<List<TeamRequestDTO>> getSent(@RequestParam Long userId, Authentication authentication) {
        return ResponseEntity.ok(teamRequestService.getSentRequests(userId, authentication.getName()));
    }

    @PutMapping("/team-requests/{id}/accept")
    public ResponseEntity<TeamRequestDTO> acceptRequest(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(teamRequestService.acceptRequest(id, authentication.getName()));
    }

    @PutMapping("/team-requests/{id}/reject")
    public ResponseEntity<TeamRequestDTO> rejectRequest(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(teamRequestService.rejectRequest(id, authentication.getName()));
    }
}
