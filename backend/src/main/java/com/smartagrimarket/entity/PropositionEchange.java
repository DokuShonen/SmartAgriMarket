package com.smartagrimarket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "propositions_echange")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PropositionEchange {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(columnDefinition = "TEXT")
    private String description;

    private BigDecimal valeurProposee;

    @Column(nullable = false)
    private String statut;

    @Column(nullable = false)
    private LocalDateTime dateCreation;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "annonce_id", nullable = false)
    private AnnonceMateriel annonce;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proposant_id", nullable = false)
    private Utilisateur proposant;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "annonce_echange_id")
    private AnnonceMateriel annonceEchange;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        statut = "EN_ATTENTE";
    }
}
