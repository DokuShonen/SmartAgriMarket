package com.smartagrimarket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "demandes_livraison")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class DemandeLivraison {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String adresseDepart;

    @Column(nullable = false)
    private String adresseArrivee;

    private Float distanceKm;

    @Column(precision = 12, scale = 2)
    private BigDecimal frais;

    private String statut;

    private LocalDateTime datePriseEnCharge;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "commande_id", nullable = false)
    private Commande commande;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "partenaire_id")
    private Utilisateur partenaire;

    @OneToMany(mappedBy = "demandeLivraison", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<SuiviLivraison> suivis;
}
