package com.smartagrimarket.entity;

import com.smartagrimarket.entity.enums.EtatMateriel;
import com.smartagrimarket.entity.enums.TypeTransaction;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "annonces_materiel")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AnnonceMateriel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(precision = 12, scale = 2)
    private BigDecimal prix;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EtatMateriel etat;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeTransaction typeTransaction;

    @Column(nullable = true)
    private String duree;

    @Column(nullable = true, precision = 12, scale = 2)
    private BigDecimal caution;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String disponibilites;

    @ElementCollection
    @CollectionTable(name = "annonce_materiel_photos", joinColumns = @JoinColumn(name = "annonce_id"))
    @Column(name = "photo_url")
    private List<String> photos;

    @Column(nullable = false)
    private String localite;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendeur_id", nullable = false)
    private Utilisateur vendeur;
}
