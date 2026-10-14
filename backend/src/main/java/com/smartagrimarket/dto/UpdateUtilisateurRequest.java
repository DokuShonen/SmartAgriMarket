package com.smartagrimarket.dto;

import lombok.Data;

@Data
public class UpdateUtilisateurRequest {
    private String nom;
    private String prenom;
    private String telephone;
    private String localite;
    private String photoProfil;
    private String zoneCouverture;
}
