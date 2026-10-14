package com.smartagrimarket.dto;

import com.smartagrimarket.entity.PropositionEchange;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class PropositionEchangeResponse {
    private UUID id;
    private String description;
    private BigDecimal valeurProposee;
    private String statut;
    private LocalDateTime dateCreation;
    private UUID annonceId;
    private String annonceTitre;
    private UUID proposantId;
    private String proposantNom;

    public static PropositionEchangeResponse from(PropositionEchange p) {
        PropositionEchangeResponse r = new PropositionEchangeResponse();
        r.id = p.getId();
        r.description = p.getDescription();
        r.valeurProposee = p.getValeurProposee();
        r.statut = p.getStatut();
        r.dateCreation = p.getDateCreation();
        if (p.getAnnonce() != null) {
            r.annonceId = p.getAnnonce().getId();
            r.annonceTitre = p.getAnnonce().getTitre();
        }
        if (p.getProposant() != null) {
            r.proposantId = p.getProposant().getId();
            r.proposantNom = p.getProposant().getPrenom() + " " + p.getProposant().getNom();
        }
        return r;
    }
}
