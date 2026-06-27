package com.smartagrimarket.entity;

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

    @PrePersist
    protected void onCreate() {
        dateInscription = LocalDateTime.now();
    }
}
