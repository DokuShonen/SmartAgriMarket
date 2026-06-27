package com.smartagrimarket.repository;

import com.smartagrimarket.entity.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface CategorieRepository extends JpaRepository<Categorie, UUID> {
    Optional<Categorie> findByNom(String nom);
}
