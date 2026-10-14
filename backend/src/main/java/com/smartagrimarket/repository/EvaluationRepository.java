package com.smartagrimarket.repository;

import com.smartagrimarket.entity.Evaluation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface EvaluationRepository extends JpaRepository<Evaluation, UUID> {
    @EntityGraph(attributePaths = {"donneur", "receveur"})
    List<Evaluation> findByDonneurId(UUID donneurId);

    @EntityGraph(attributePaths = {"donneur", "receveur"})
    List<Evaluation> findByReceveurId(UUID receveurId);
}
