package com.smartagrimarket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "paiements")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal montant;

    @Column(nullable = false)
    private String methode;

    private String reference;

    @Column(nullable = false)
    private String statut;

    private LocalDateTime datePaiement;

    @Column(nullable = false)
    private boolean rembourse;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id", nullable = false)
    private Commande commande;

    @PrePersist
    protected void onCreate() {
        datePaiement = LocalDateTime.now();
    }
}
