package com.example.teamfinder.controller;

import com.example.teamfinder.dto.ProjectDTO;
import com.example.teamfinder.dto.TeamRequestDTO;
import com.example.teamfinder.dto.UserDTO;
import com.example.teamfinder.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(adminService.getSystemStats());
    }

    @GetMapping("/students")
    public ResponseEntity<List<UserDTO>> getStudents() {
        return ResponseEntity.ok(adminService.getAllStudents());
    }

    @GetMapping("/projects")
    public ResponseEntity<List<ProjectDTO>> getProjects() {
        return ResponseEntity.ok(adminService.getAllProjects());
    }

    @GetMapping("/team-requests")
    public ResponseEntity<List<TeamRequestDTO>> getTeamRequests() {
        return ResponseEntity.ok(adminService.getAllRequests());
    }
}
