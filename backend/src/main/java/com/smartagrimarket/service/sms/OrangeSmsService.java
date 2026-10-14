package com.smartagrimarket.service.sms;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Slf4j
@Service
@ConditionalOnProperty(name = "sms.provider", havingValue = "orange")
public class OrangeSmsService implements SmsService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${sms.orange.api-url}")
    private String apiUrl;

    @Value("${sms.orange.client-id}")
    private String clientId;

    @Value("${sms.orange.client-secret}")
    private String clientSecret;

    private String accessToken;

    @Override
    public void envoyer(String telephone, String message) {
        try {
            authentifier();
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = Map.of(
                "outboundSMSMessageRequest", Map.of(
                    "address", "tel:" + telephone,
                    "senderAddress", "tel:+2260000",
                    "outboundTextMessage", Map.of("message", message)
                )
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            restTemplate.postForEntity(apiUrl + "/smsmessaging/v1/outbound/tel:+2260000/requests", request, String.class);
            log.info("SMS envoyé à {}", telephone);
        } catch (Exception e) {
            log.error("Échec envoi SMS à {}: {}", telephone, e.getMessage());
        }
    }

    private void authentifier() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, String> authBody = Map.of(
            "grant_type", "client_credentials",
            "client_id", clientId,
            "client_secret", clientSecret
        );
        try {
            var response = restTemplate.postForEntity(
                apiUrl + "/oauth/v2/token",
                new HttpEntity<>(authBody, headers),
                Map.class
            );
            accessToken = (String) response.getBody().get("access_token");
        } catch (Exception e) {
            log.error("Échec authentification Orange SMS: {}", e.getMessage());
        }
    }
}
