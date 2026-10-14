package com.smartagrimarket.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private static final Set<String> IMAGE_TYPES = Set.of("image/jpeg", "image/png", "image/webp");
    private static final int MAX_DIM = 1200;

    @Value("${upload.dir:./uploads}")
    private String uploadDir;

    private static final long MAX_FILE_SIZE = 5_242_880; // 5 MB

    @PostMapping
    public ResponseEntity<Map<String, String>> upload(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Fichier vide"));
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest().body(Map.of("error", "Fichier trop volumineux (max 5 Mo)"));
        }
        String contentType = file.getContentType();
        if (contentType == null || !IMAGE_TYPES.contains(contentType)) {
            return ResponseEntity.badRequest().body(Map.of("error",
                    "Type de fichier non supporté. Accepté : JPEG, PNG, WebP"));
        }
        String ext = ".jpg";
        if (file.getOriginalFilename() != null && file.getOriginalFilename().contains(".")) {
            ext = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.'));
        }
        String filename = UUID.randomUUID() + ext;
        Path path = Paths.get(uploadDir).resolve(filename);
        Files.createDirectories(path.getParent());
        Files.write(path, redimensionnerImage(file));
        return ResponseEntity.ok(Map.of("url", "/uploads/" + filename, "filename", filename));
    }

    private byte[] redimensionnerImage(MultipartFile file) throws IOException {
        String ct = file.getContentType();
        if (ct == null || !IMAGE_TYPES.contains(ct)) return file.getBytes();

        BufferedImage img = ImageIO.read(new ByteArrayInputStream(file.getBytes()));
        if (img == null) return file.getBytes();

        int w = img.getWidth(), h = img.getHeight();
        if (w <= MAX_DIM && h <= MAX_DIM) return file.getBytes();

        double r = Math.min((double) MAX_DIM / w, (double) MAX_DIM / h);
        int nw = (int) (w * r), nh = (int) (h * r);
        BufferedImage resized = new BufferedImage(nw, nh, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = resized.createGraphics();
        g.drawImage(img, 0, 0, nw, nh, null);
        g.dispose();

        String fmt = "jpg";
        if ("image/png".equals(ct)) fmt = "png";
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ImageIO.write(resized, fmt, out);
        return out.toByteArray();
    }
}
