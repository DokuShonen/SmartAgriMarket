package com.smartagrimarket.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ArticleForumRequest {
    @NotBlank private String titre;
    @NotBlank private String contenu;
    @NotBlank private String categorie;
}
