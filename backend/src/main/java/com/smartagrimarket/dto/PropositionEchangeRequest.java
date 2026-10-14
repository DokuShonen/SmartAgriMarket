package com.smartagrimarket.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class PropositionEchangeRequest {
    @NotNull private UUID annonceId;
    private String description;
    private BigDecimal valeurProposee;
    private UUID annonceEchangeId;
}
