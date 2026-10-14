package com.smartagrimarket.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "articles_forum")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ArticleForum {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String contenu;

    @Column(nullable = false)
    private String categorie;

    @Column(nullable = false)
    private LocalDateTime datePublication;

    @Column(nullable = false)
    private boolean estModere;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "auteur_id", nullable = false)
    private Utilisateur auteur;

    @PrePersist
    protected void onCreate() {
        datePublication = LocalDateTime.now();
    }
}
