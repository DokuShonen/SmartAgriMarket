package com.smartagrimarket.repository;

import com.smartagrimarket.entity.AnnonceMateriel;
import com.smartagrimarket.entity.enums.TypeTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AnnonceMaterielRepository extends JpaRepository<AnnonceMateriel, UUID> {
    List<AnnonceMateriel> findByVendeurId(UUID vendeurId);
    List<AnnonceMateriel> findByTypeTransaction(TypeTransaction typeTransaction);
    List<AnnonceMateriel> findByLocalite(String localite);
}
