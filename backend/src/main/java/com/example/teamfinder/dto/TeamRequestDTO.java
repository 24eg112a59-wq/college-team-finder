package com.example.teamfinder.dto;

import com.example.teamfinder.entity.TeamRequest;
import java.time.LocalDateTime;

public record TeamRequestDTO(Long id, Long projectId, String projectTitle, Long senderId, String senderName,
                             Long receiverId, String receiverName, String status, LocalDateTime createdAt) {
    public static TeamRequestDTO from(TeamRequest request) {
        return new TeamRequestDTO(request.getId(), request.getProject().getId(), request.getProject().getTitle(),
            request.getSender().getId(), request.getSender().getName(), request.getReceiver().getId(),
            request.getReceiver().getName(), request.getStatus().name(), request.getCreatedAt());
    }
}
