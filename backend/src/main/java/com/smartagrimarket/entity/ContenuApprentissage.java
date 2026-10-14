package com.smartagrimarket.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "contenus_apprentissage")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ContenuApprentissage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String titre;

    @Column(nullable = false)
    private String typeContenu;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String contenu;

    @Column(nullable = false)
    private boolean estValide;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "auteur_id")
    private Utilisateur auteur;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "valide_par_id")
    private Utilisateur validePar;
}
