package com.smartagrimarket.dto;

import com.smartagrimarket.entity.enums.TypeUtilisateur;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank private String nom;
    @NotBlank private String prenom;
    @Email @NotBlank private String email;
    @NotBlank private String telephone;
    @NotBlank private String motDePasse;
    @NotBlank private String localite;
    @NotNull private TypeUtilisateur type;
}
