package com.smartagrimarket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class DemandeLivraisonRequest {
    @NotBlank private String adresseArrivee;
    private String notes;
}
