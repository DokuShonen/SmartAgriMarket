package com.smartagrimarket.dto;

import com.smartagrimarket.entity.enums.EtatMateriel;
import com.smartagrimarket.entity.enums.TypeTransaction;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class AnnonceMaterielRequest {
    @NotBlank private String titre;
    private String description;
    private BigDecimal prix;
    @NotNull private EtatMateriel etat;
    @NotNull private TypeTransaction typeTransaction;
    private List<String> photos;
    @NotBlank private String localite;
    private String duree;
    private BigDecimal caution;
    private String disponibilites;
}
