package com.smartagrimarket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "commentaires")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Commentaire {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String contenu;

    @Column(nullable = false)
    private int likes;

    @Column(nullable = false)
    private LocalDateTime dateCreation;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id")
    private ArticleForum article;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contenu_apprentissage_id")
    private ContenuApprentissage contenuApprentissage;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auteur_id", nullable = false)
    private Utilisateur auteur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Commentaire parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Commentaire> reponses;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "commentaire_likes",
            joinColumns = @JoinColumn(name = "commentaire_id"),
            inverseJoinColumns = @JoinColumn(name = "utilisateur_id"))
    private Set<Utilisateur> likedPar;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        likes = 0;
    }
}
