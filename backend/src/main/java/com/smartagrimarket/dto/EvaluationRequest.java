package com.smartagrimarket.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class EvaluationRequest {
    @NotNull private UUID receveurId;
    @NotNull @Min(1) @Max(5) private Integer note;
    private String commentaire;
}
