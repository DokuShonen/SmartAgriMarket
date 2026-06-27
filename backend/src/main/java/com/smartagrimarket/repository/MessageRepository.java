package com.smartagrimarket.repository;

import com.smartagrimarket.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    List<Message> findByConversationIdOrderByDateEnvoiAsc(UUID conversationId);
    List<Message> findByExpediteurId(UUID expediteurId);
}
