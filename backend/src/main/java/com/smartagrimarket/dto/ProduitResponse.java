package com.smartagrimarket.dto;

import com.smartagrimarket.entity.Produit;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class ProduitResponse {
    private UUID id;
    private String titre;
    private String description;
    private BigDecimal prix;
    private String uniteVente;
    private Integer quantiteDisponible;
    private UUID categorieId;
    private String categorie;
    private String localite;
    private List<String> photos;
    private LocalDateTime datePublication;
    private String conditionsLivraison;
    private LocalDate dateRecolte;
    private String ficheTechnique;
    private boolean estActif;
    private UUID vendeurId;
    private String vendeurNom;
    private boolean vendeurEstVerifie;

    public static ProduitResponse from(Produit p) {
        ProduitResponse r = new ProduitResponse();
        r.id = p.getId();
        r.titre = p.getTitre();
        r.description = p.getDescription();
        r.prix = p.getPrix();
        r.uniteVente = p.getUniteVente();
        r.quantiteDisponible = p.getQuantiteDisponible();
        r.categorieId = p.getCategorie().getId();
        r.categorie = p.getCategorie().getNom();
        r.localite = p.getLocalite();
        r.photos = p.getPhotos() != null ? new java.util.ArrayList<>(p.getPhotos()) : new java.util.ArrayList<>();
        r.datePublication = p.getDatePublication();
        r.conditionsLivraison = p.getConditionsLivraison();
        r.dateRecolte = p.getDateRecolte();
        r.ficheTechnique = p.getFicheTechnique();
        r.estActif = p.isEstActif();
        r.vendeurId = p.getVendeur().getId();
        r.vendeurNom = p.getVendeur().getPrenom() + " " + p.getVendeur().getNom();
        r.vendeurEstVerifie = p.getVendeur().isEstVerifie();
        return r;
    }
}
