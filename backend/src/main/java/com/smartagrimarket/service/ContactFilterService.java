package com.smartagrimarket.service;

import java.util.regex.Pattern;

public class ContactFilterService {

    public static final Pattern COORDONNEES_PATTERN =
            Pattern.compile(
                "(\\+\\d{1,3}[\\s.-]?\\d{4,14}" +
                "|0\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}" +
                "|\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}" +
                "|[5-7]\\d[\\s.-]?\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}" +
                "|[\\w.-]+@[\\w.-]+\\.\\w{2,}" +
                "|https?://\\S+" +
                "|www\\.\\S+)"
            );

    public static String filterCoordonnees(String contenu) {
        return COORDONNEES_PATTERN.matcher(contenu).replaceAll("[coordonnées masquées]");
    }
}
