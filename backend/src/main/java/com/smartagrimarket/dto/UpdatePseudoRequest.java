package com.smartagrimarket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdatePseudoRequest {
    @NotBlank
    @Size(min = 4, max = 30)
    private String pseudo;
}
