package com.smartagrimarket.entity;

import com.smartagrimarket.entity.enums.StatutBadge;
import com.smartagrimarket.entity.enums.TypeBadge;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "badges")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Badge {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeBadge type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutBadge statut;

    @Column(columnDefinition = "TEXT")
    private String documentUrl;

    private String commentaire;

    @Column(nullable = false)
    private LocalDateTime dateDemande;

    private LocalDateTime dateTraitement;

    @PrePersist
    protected void onCreate() {
        dateDemande = LocalDateTime.now();
        if (statut == null) statut = StatutBadge.EN_ATTENTE;
    }
}
