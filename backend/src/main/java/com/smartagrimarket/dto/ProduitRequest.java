package com.smartagrimarket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class ProduitRequest {
    @NotBlank private String titre;
    private String description;
    @NotNull @Positive private BigDecimal prix;
    @NotBlank private String uniteVente;
    @NotNull @Positive private Integer quantiteDisponible;
    @NotNull private UUID categorieId;
    @NotBlank private String localite;
    private List<String> photos;
    private String conditionsLivraison;
}
