package com.smartagrimarket.dto;

import com.smartagrimarket.entity.enums.TypeBadge;
import lombok.Data;

@Data
public class BadgeRequest {
    private TypeBadge type;
    private String documentUrl;
    private String commentaire;
}
