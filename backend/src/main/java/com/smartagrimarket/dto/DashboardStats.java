package com.smartagrimarket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private long totalUtilisateurs;
    private long totalProducteurs;
    private long totalAcheteurs;
    private long totalCommandes;
    private long commandesAbouties;
    private BigDecimal revenuTotal;
    private long totalProduits;
    private List<MoisStats> commandesParMois;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MoisStats {
        private int annee;
        private int mois;
        private long nombreCommandes;
        private BigDecimal montantTotal;
    }
}
