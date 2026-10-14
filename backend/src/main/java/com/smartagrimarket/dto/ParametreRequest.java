package com.smartagrimarket.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ParametreRequest {
    @NotBlank
    private String cle;
    @NotBlank
    private String valeur;
    private String type;
    private String description;
}
