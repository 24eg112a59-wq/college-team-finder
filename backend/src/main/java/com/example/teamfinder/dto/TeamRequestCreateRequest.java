package com.example.teamfinder.dto;

import jakarta.validation.constraints.NotNull;

public record TeamRequestCreateRequest(
    @NotNull Long projectId,
    @NotNull Long senderId,
    @NotNull Long receiverId
) {
}
