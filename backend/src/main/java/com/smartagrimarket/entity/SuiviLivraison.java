package com.smartagrimarket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "suivis_livraison")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SuiviLivraison {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String statut;

    private String localisation;

    @Column(nullable = false)
    private LocalDateTime dateMAJ;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "demande_livraison_id", nullable = false)
    private DemandeLivraison demandeLivraison;

    @PrePersist
    protected void onCreate() {
        dateMAJ = LocalDateTime.now();
    }
}
