package com.smartagrimarket.repository;

import com.smartagrimarket.entity.PropositionEchange;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface PropositionEchangeRepository extends JpaRepository<PropositionEchange, UUID> {
    List<PropositionEchange> findByAnnonceId(UUID annonceId);
    List<PropositionEchange> findByProposantId(UUID proposantId);
}
