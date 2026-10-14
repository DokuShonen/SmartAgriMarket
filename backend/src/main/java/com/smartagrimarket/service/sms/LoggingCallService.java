package com.smartagrimarket.service.sms;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class LoggingCallService implements CallService {

    @Override
    public void appeler(String telephone, String messageTexte) {
        log.info("[APPEL] À {} → Message vocal : {}", telephone, messageTexte);
    }
}
