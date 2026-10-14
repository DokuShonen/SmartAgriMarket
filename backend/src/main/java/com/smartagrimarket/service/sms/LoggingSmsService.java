package com.smartagrimarket.service.sms;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@ConditionalOnProperty(name = "sms.provider", havingValue = "logging", matchIfMissing = true)
public class LoggingSmsService implements SmsService {

    @Override
    public void envoyer(String telephone, String message) {
        log.info("[SMS] À {} → {}", telephone, message);
    }
}
