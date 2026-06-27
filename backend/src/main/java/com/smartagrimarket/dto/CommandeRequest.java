package com.smartagrimarket.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class CommandeRequest {
    @NotEmpty private List<LigneCommandeRequest> lignes;
    private boolean avecLivraison;
    private String adresseLivraison;
    private String notes;

    @Data
    public static class LigneCommandeRequest {
        @NotNull private UUID produitId;
        @NotNull private Integer quantite;
    }
}
