package com.smartagrimarket.dto;

import com.smartagrimarket.entity.Parametre;
import lombok.Data;
import java.util.UUID;

@Data
public class ParametreResponse {
    private UUID id;
    private String cle;
    private String valeur;
    private String type;
    private String description;

    public static ParametreResponse from(Parametre p) {
        ParametreResponse r = new ParametreResponse();
        r.id = p.getId();
        r.cle = p.getCle();
        r.valeur = p.getValeur();
        r.type = p.getType();
        r.description = p.getDescription();
        return r;
    }
}
