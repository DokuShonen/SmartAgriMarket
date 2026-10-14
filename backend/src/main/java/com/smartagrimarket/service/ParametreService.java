package com.smartagrimarket.service;

import com.smartagrimarket.dto.ParametreRequest;
import com.smartagrimarket.dto.ParametreResponse;
import com.smartagrimarket.entity.Parametre;
import com.smartagrimarket.repository.ParametreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ParametreService {

    private final ParametreRepository parametreRepository;

    @Transactional(readOnly = true)
    public List<ParametreResponse> getAll() {
        return parametreRepository.findAll().stream()
                .map(ParametreResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ParametreResponse getByCle(String cle) {
        return parametreRepository.findByCle(cle)
                .map(ParametreResponse::from)
                .orElseThrow(() -> new RuntimeException("Paramètre introuvable : " + cle));
    }

    @Transactional
    public ParametreResponse save(ParametreRequest request) {
        Parametre p = parametreRepository.findByCle(request.getCle())
                .orElse(Parametre.builder()
                        .cle(request.getCle())
                        .type(request.getType() != null ? request.getType() : "STRING")
                        .description(request.getDescription())
                        .build());
        p.setValeur(request.getValeur());
        return ParametreResponse.from(parametreRepository.save(p));
    }

    @Transactional
    public void delete(UUID id) {
        parametreRepository.deleteById(id);
    }

    public BigDecimal getCommissionRate() {
        return parametreRepository.findByCle("commission_rate")
                .map(p -> new BigDecimal(p.getValeur()))
                .orElse(BigDecimal.valueOf(5));
    }

    public String getYengaPayApiKey() {
        return parametreRepository.findByCle("yengapay_api_key")
                .map(Parametre::getValeur)
                .orElse("");
    }

    public String getYengaPayMerchantId() {
        return parametreRepository.findByCle("yengapay_merchant_id")
                .map(Parametre::getValeur)
                .orElse("");
    }

    public boolean isYengaPayEnabled() {
        return parametreRepository.findByCle("yengapay_enabled")
                .map(p -> "true".equalsIgnoreCase(p.getValeur()))
                .orElse(false);
    }
}
