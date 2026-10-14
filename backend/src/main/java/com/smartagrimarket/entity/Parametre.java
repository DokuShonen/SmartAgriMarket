package com.smartagrimarket.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "parametres")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Parametre {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String cle;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String valeur;

    @Column(nullable = false)
    @Builder.Default
    private String type = "STRING";

    private String description;
}
