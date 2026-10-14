package com.smartagrimarket.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "evaluations")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private Integer note;

    @Column(columnDefinition = "TEXT")
    private String commentaire;

    @Column(nullable = false)
    private LocalDateTime dateCreation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "donneur_id", nullable = false)
    private Utilisateur donneur;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receveur_id", nullable = false)
    private Utilisateur receveur;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
    }
}
