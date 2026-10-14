package com.smartagrimarket.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.UUID;

@Data
public class CommentaireRequest {
    private UUID articleId;
    private UUID contenuApprentissageId;
    @NotBlank private String contenu;
    private UUID parentId;
}
