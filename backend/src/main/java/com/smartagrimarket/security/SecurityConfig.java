package com.smartagrimarket.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/ws/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/produits").permitAll()
                .requestMatchers("/api/produits/vendeur/me").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/produits/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/produits").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/produits/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/produits/**").authenticated()
                .requestMatchers("/api/categories").permitAll()
                .requestMatchers("/api/cours-semences").permitAll()
                .requestMatchers("/api/produits-vedettes").permitAll()
                .requestMatchers("/api/health").permitAll()
                .requestMatchers("/api/materiel").permitAll()
                .requestMatchers("/api/materiel/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/forum/articles").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/forum/articles/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/forum/articles").authenticated()
                .requestMatchers("/api/forum/apprentissage").permitAll()
                .requestMatchers("/api/forum/apprentissage/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/commentaires/article/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/commentaires/apprentissage/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/api/logistique/en-attente").authenticated()
                .requestMatchers("/api/logistique/mes-demandes").authenticated()
                .requestMatchers("/api/logistique/mes-livraisons").authenticated()
                .requestMatchers("/api/utilisateurs").authenticated()
                .requestMatchers("/api/utilisateurs/**").authenticated()
                .requestMatchers("/api/badges/mes-badges").authenticated()
                .requestMatchers("/api/badges/demander").authenticated()
                .requestMatchers("/api/badges/en-attente").authenticated()
                .requestMatchers("/api/badges/*/traiter").authenticated()
                .requestMatchers("/api/badges/verifier/**").permitAll()
                .requestMatchers("/api/badges/utilisateur/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
