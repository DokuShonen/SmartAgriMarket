package com.smartagrimarket.dto;

import com.smartagrimarket.entity.AnnonceMateriel;
import com.smartagrimarket.entity.enums.EtatMateriel;
import com.smartagrimarket.entity.enums.TypeTransaction;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class AnnonceMaterielResponse {
    private UUID id;
    private String titre;
    private String description;
    private BigDecimal prix;
    private EtatMateriel etat;
    private TypeTransaction typeTransaction;
    private List<String> photos;
    private String localite;
    private UUID vendeurId;
    private String vendeurNom;
    private String duree;
    private BigDecimal caution;
    private String disponibilites;

    public static AnnonceMaterielResponse from(AnnonceMateriel a) {
        AnnonceMaterielResponse r = new AnnonceMaterielResponse();
        r.id = a.getId();
        r.titre = a.getTitre();
        r.description = a.getDescription();
        r.prix = a.getPrix();
        r.etat = a.getEtat();
        r.typeTransaction = a.getTypeTransaction();
        r.photos = a.getPhotos() != null ? new java.util.ArrayList<>(a.getPhotos()) : new java.util.ArrayList<>();
        r.localite = a.getLocalite();
        r.vendeurId = a.getVendeur().getId();
        r.vendeurNom = a.getVendeur().getPrenom() + " " + a.getVendeur().getNom();
        r.duree = a.getDuree();
        r.caution = a.getCaution();
        r.disponibilites = a.getDisponibilites();
        return r;
    }
}
