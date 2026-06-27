package com.smartagrimarket.repository;

import com.smartagrimarket.entity.ContenuApprentissage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ContenuApprentissageRepository extends JpaRepository<ContenuApprentissage, UUID> {
    List<ContenuApprentissage> findByTypeContenu(String typeContenu);
    List<ContenuApprentissage> findByEstValide(boolean estValide);
}
