package com.smartagrimarket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class MessageRequest {
    @NotNull private UUID conversationId;
    @NotBlank private String contenu;
}
