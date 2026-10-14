package com.smartagrimarket.dto;

import com.smartagrimarket.entity.enums.TypeUtilisateur;
import lombok.Data;

@Data
public class CreerAdminRequest {
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String localite;
    private String motDePasse;
    private TypeUtilisateur type;
}
