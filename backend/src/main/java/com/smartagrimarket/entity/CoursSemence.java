package com.smartagrimarket.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "cours_semences")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CoursSemence {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String produit;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal prix;

    @Column(nullable = false)
    private String localite;

    @Column(nullable = false)
    private LocalDateTime dateMAJ;

    private String source;

    @PrePersist
    protected void onCreate() {
        dateMAJ = LocalDateTime.now();
    }
}
