package com.smartagrimarket.repository;

import com.smartagrimarket.entity.ProduitVedette;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ProduitVedetteRepository extends JpaRepository<ProduitVedette, UUID> {
    List<ProduitVedette> findByEstActive(boolean estActive);
}
