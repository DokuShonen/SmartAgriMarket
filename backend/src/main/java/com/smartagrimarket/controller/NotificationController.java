package com.smartagrimarket.controller;

import com.smartagrimarket.entity.Notification;
import com.smartagrimarket.security.SecurityUtil;
import com.smartagrimarket.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final SecurityUtil securityUtil;

    @GetMapping
    public ResponseEntity<List<Notification>> getMesNotifications() {
        UUID userId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(notificationService.getMesNotifications(userId));
    }

    @GetMapping("/non-lues")
    public ResponseEntity<Map<String, Long>> getNonLues() {
        UUID userId = securityUtil.getCurrentUserId();
        long count = notificationService.getNonLues(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PatchMapping("/{id}/lue")
    public ResponseEntity<Void> marquerLue(@PathVariable UUID id) {
        notificationService.marquerLue(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/tout-lu")
    public ResponseEntity<Void> marquerToutLu() {
        UUID userId = securityUtil.getCurrentUserId();
        notificationService.marquerToutLu(userId);
        return ResponseEntity.ok().build();
    }
}
