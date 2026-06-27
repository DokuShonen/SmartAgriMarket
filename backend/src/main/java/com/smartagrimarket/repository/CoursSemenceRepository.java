package com.smartagrimarket.repository;

import com.smartagrimarket.entity.CoursSemence;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CoursSemenceRepository extends JpaRepository<CoursSemence, UUID> {
    List<CoursSemence> findByLocalite(String localite);
    List<CoursSemence> findByProduit(String produit);
}
