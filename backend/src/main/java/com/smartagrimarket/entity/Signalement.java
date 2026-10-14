package com.smartagrimarket.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "signalements")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Signalement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String typeCible;

    @Column(nullable = false)
    private UUID cibleId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String motif;

    @Column(nullable = false)
    private String statut;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auteur_id", nullable = false)
    private Utilisateur auteur;

    @Column(nullable = false)
    private LocalDateTime dateCreation;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        if (statut == null) statut = "EN_ATTENTE";
    }
}
