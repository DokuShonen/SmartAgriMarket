package com.smartagrimarket.dto;

import com.smartagrimarket.entity.ProduitVedette;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ProduitVedetteResponse {
    private UUID id;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private boolean estActive;
    private ProduitResponse produit;

    public static ProduitVedetteResponse from(ProduitVedette pv) {
        ProduitVedetteResponse r = new ProduitVedetteResponse();
        r.id = pv.getId();
        r.dateDebut = pv.getDateDebut();
        r.dateFin = pv.getDateFin();
        r.estActive = pv.isEstActive();
        r.produit = ProduitResponse.from(pv.getProduit());
        return r;
    }
}
