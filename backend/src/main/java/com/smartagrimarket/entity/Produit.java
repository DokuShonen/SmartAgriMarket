package com.smartagrimarket.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.OptimisticLockType;
import org.hibernate.annotations.OptimisticLocking;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "produits")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@OptimisticLocking(type = OptimisticLockType.VERSION)
public class Produit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Version
    private Long version;

    @Column(nullable = false, columnDefinition = "VARCHAR(255)")
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal prix;

    @Column(nullable = false)
    private String uniteVente;

    @Column(nullable = false)
    private Integer quantiteDisponible;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categorie_id", nullable = false)
    private Categorie categorie;

    @Column(nullable = false)
    private String localite;

    @ElementCollection
    @CollectionTable(name = "produit_photos", joinColumns = @JoinColumn(name = "produit_id"))
    @Column(name = "photo_url")
    @BatchSize(size = 20)
    private List<String> photos;

    @Column(nullable = false)
    private LocalDateTime datePublication;

    @Column(columnDefinition = "TEXT")
    private String conditionsLivraison;

    @Column(nullable = true)
    private LocalDate dateRecolte;

    @Column(nullable = true)
    private String ficheTechnique;

    @Column(nullable = false)
    private boolean estActif = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendeur_id", nullable = false)
    private Utilisateur vendeur;

    @PrePersist
    protected void onCreate() {
        datePublication = LocalDateTime.now();
    }
}
