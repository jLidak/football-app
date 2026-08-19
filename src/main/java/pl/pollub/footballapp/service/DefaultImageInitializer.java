package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class DefaultImageInitializer {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostConstruct
    public void initializeDefaultImages() {
        try {
            // Ścieżki do folderów docelowych
            Path playerDir = Paths.get(uploadDir, "player");
            Path teamDir = Paths.get(uploadDir, "team");

            // Tworzenie katalogów, jeśli nie istnieją
            if (!Files.exists(playerDir)) {
                Files.createDirectories(playerDir);
            }
            if (!Files.exists(teamDir)) {
                Files.createDirectories(teamDir);
            }

            // Kopiowanie domyślnych obrazów
            copyDefaultImage("default-player.png", playerDir);
            copyDefaultImage("default-team.png", teamDir);

        } catch (IOException e) {
            System.err.println("Błąd podczas inicjalizacji domyślnych obrazów: " + e.getMessage());
        }
    }

    private void copyDefaultImage(String imageName, Path targetDir) throws IOException {
        // Wczytanie pliku z zasobów
        ClassPathResource resource = new ClassPathResource("static/img/default-images/" + imageName);
        if (!resource.exists()) {
            System.err.println("Domyślny obraz nie został znaleziony w zasobach: " + imageName);
            return;
        }

        Path targetImagePath = targetDir.resolve(imageName);

        // Kopiowanie tylko, jeśli plik jeszcze nie istnieje
        if (!Files.exists(targetImagePath)) {
            try (InputStream inputStream = resource.getInputStream()) {
                Files.copy(inputStream, targetImagePath);
                System.out.println("Skopiowano domyślny obraz: " + targetImagePath.toString());
            }
        }
    }
}
