package com.smartagrimarket.dto;

import com.smartagrimarket.entity.Commande;
import com.smartagrimarket.entity.LigneCommande;
import com.smartagrimarket.entity.enums.StatutCommande;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class CommandeResponse {
    private UUID id;
    private LocalDateTime dateCreation;
    private StatutCommande statut;
    private BigDecimal montantTotal;
    private BigDecimal fraisLivraison;
    private String adresseLivraison;
    private String notes;
    private UUID acheteurId;
    private String acheteurNom;
    private UUID producteurId;
    private String producteurNom;
    private String modePaiement;
    private String paiementStatut;
    private List<LigneResponse> lignes;

    @Data
    public static class LigneResponse {
        private UUID produitId;
        private String produitTitre;
        private Integer quantite;
        private BigDecimal prixUnitaire;
    }

    public static CommandeResponse from(Commande c) {
        CommandeResponse r = new CommandeResponse();
        r.id = c.getId();
        r.dateCreation = c.getDateCreation();
        r.statut = c.getStatut();
        r.montantTotal = c.getMontantTotal();
        r.fraisLivraison = c.getFraisLivraison();
        r.adresseLivraison = c.getAdresseLivraison();
        r.notes = c.getNotes();
        r.acheteurId = c.getAcheteur().getId();
        r.acheteurNom = c.getAcheteur().getPrenom() + " " + c.getAcheteur().getNom();
        r.producteurId = c.getProducteur().getId();
        r.producteurNom = c.getProducteur().getPrenom() + " " + c.getProducteur().getNom();
        r.modePaiement = c.getModePaiement();
        if (c.getPaiement() != null) {
            r.paiementStatut = c.getPaiement().getStatut();
        }
        if (c.getLignes() != null) {
            r.lignes = c.getLignes().stream().map(l -> {
                LigneResponse lr = new LigneResponse();
                lr.produitId = l.getProduit().getId();
                lr.produitTitre = l.getProduit().getTitre();
                lr.quantite = l.getQuantite();
                lr.prixUnitaire = l.getPrixUnitaire();
                return lr;
            }).toList();
        }
        return r;
    }
}
