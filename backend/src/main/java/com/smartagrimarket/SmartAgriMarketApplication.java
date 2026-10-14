package com.smartagrimarket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SmartAgriMarketApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartAgriMarketApplication.class, args);
    }
}
