package com.smartagrimarket.dto;

import com.smartagrimarket.entity.enums.TypeUtilisateur;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank private String nom;
    @NotBlank private String prenom;
    @Email @NotBlank private String email;
    @NotBlank private String telephone;
    @NotBlank @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
             message = "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre")
    private String motDePasse;
    @NotBlank private String localite;
    @NotNull private TypeUtilisateur type;
    private String cnib;
    private String cooperative;
    private String photoCertificationBio;
    private String zoneCouverture;
}
