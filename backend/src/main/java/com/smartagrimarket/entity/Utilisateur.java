package com.smartagrimarket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.smartagrimarket.entity.enums.TypeUtilisateur;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "utilisateurs")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String telephone;

    @JsonIgnore
    @Column(nullable = false)
    private String motDePasse;

    @Column(nullable = false)
    private String localite;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeUtilisateur type;

    @Column(nullable = false)
    private LocalDateTime dateInscription;

    @Column(nullable = false)
    private boolean estVerifie;

    @Column(nullable = false)
    private int violationsCount;

    @Column(nullable = false)
    private boolean estSuspendu;

    @Column(unique = true)
    private String pseudoForum;

    @Column(nullable = true)
    private String cnib;

    @Column(nullable = true)
    private String cooperative;

    @Column(nullable = true)
    private String photoCertificationBio;

    @Column(nullable = true)
    private String photoProfil;

    @Column(nullable = true)
    private String zoneCouverture;

    @Column(nullable = false)
    @Builder.Default
    private int creditsRelation = 0;

    @PrePersist
    protected void onCreate() {
        dateInscription = LocalDateTime.now();
    }
}
