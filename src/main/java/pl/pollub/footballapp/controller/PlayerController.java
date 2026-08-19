package pl.pollub.footballapp.controller;

import jakarta.annotation.security.PermitAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.requests.PlayerRequest;
import pl.pollub.footballapp.model.Player;
import pl.pollub.footballapp.service.PlayerService;
import pl.pollub.footballapp.service.FileStorageService;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/players")
public class PlayerController {
    private PlayerService playerService;
    private ImporterFactory importerFactory;

    @Autowired
    public PlayerController(PlayerService playerService, ImporterFactory importerFactory) {
        this.playerService = playerService;
        this.importerFactory = importerFactory;
    }


    //    @PostMapping("/add")
//    @PreAuthorize("hasRole('MODERATOR')")
//    public ResponseEntity<?> addPlayer(
//            @RequestParam("firstName") String firstName,
//            @RequestParam("lastName") String lastName,
//            @RequestParam("dateOfBirth") String dateOfBirth,
//            @RequestParam("nickname") String nickname,
//            @RequestParam("positionId") Long positionId,
//            @RequestParam("countryId") Long countryId,
//            @RequestParam(value = "value", required = false) BigDecimal value,
//            @RequestParam(value = "picture", required = false) MultipartFile picture) {
//        try {
//            // Tworzymy obiekt PlayerRequest bez ustawionej ścieżki obrazu
//            PlayerRequest playerRequest = new PlayerRequest(firstName, lastName, dateOfBirth, nickname, positionId, countryId, value);
//
//            // Zapisujemy Player, aby uzyskać ID
//            Long playerId = playerService.addPlayerAndGetId(playerRequest);
//
//            // Ustawiamy ścieżkę obrazu na podstawie uzyskanego ID
//            if (picture != null) {
//                String photoPath = fileStorageService.saveImage(picture, "player_" + playerId,"player");
//                playerService.updatePlayerPhotoPath(playerId, photoPath);
//            }
//
//            return ResponseEntity.ok("Player added successfully");
//        } catch (IOException e) {
//            return ResponseEntity.status(500).body("Error saving picture: " + e.getMessage());
//        }
//    }
    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<String> addPlayer(
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("dateOfBirth") String dateOfBirth,
            @RequestParam("nickname") String nickname,
            @RequestParam("positionId") Long positionId,
            @RequestParam("countryId") Long countryId,
            @RequestParam(value = "value", required = false) BigDecimal value,
            @RequestParam(value = "picture", required = false) MultipartFile picture) {
        playerService.addPlayerWithPicture(firstName, lastName, dateOfBirth, nickname, positionId, countryId, value, picture);
        return ResponseEntity.ok("Player added successfully");
    }


    //    @PutMapping("/{id}")
//    @PreAuthorize("hasRole('MODERATOR')")
//    public ResponseEntity<?> updatePlayer(
//            @PathVariable Long id,
//            @RequestParam("firstName") String firstName,
//            @RequestParam("lastName") String lastName,
//            @RequestParam("dateOfBirth") String dateOfBirth,
//            @RequestParam("nickname") String nickname,
//            @RequestParam("positionId") Long positionId,
//            @RequestParam("countryId") Long countryId,
//            @RequestParam(value = "value", required = false) BigDecimal value,
//            @RequestParam(value = "picture", required = false) MultipartFile picture) {
//        try {
//            PlayerRequest playerRequest = new PlayerRequest(firstName, lastName, dateOfBirth, nickname, positionId, countryId, value);
//
//            // Przetwarzaj plik zdjęcia, jeśli został przesłany
//            String photoPath = null;
//            if (picture != null) {
//                photoPath = fileStorageService.saveImage(picture, "player_" + id, "player");
//                playerRequest.setPicture(photoPath);
//            }
//
//            playerService.updatePlayer(id, playerRequest);
//            return ResponseEntity.ok("Player updated successfully");
//        } catch (RuntimeException e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        } catch (IOException e) {
//            return ResponseEntity.status(500).body("Error saving picture: " + e.getMessage());
//        }
//    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<String> updatePlayer(
            @PathVariable Long id,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("dateOfBirth") String dateOfBirth,
            @RequestParam("nickname") String nickname,
            @RequestParam("positionId") Long positionId,
            @RequestParam("countryId") Long countryId,
            @RequestParam(value = "value", required = false) BigDecimal value,
            @RequestParam(value = "picture", required = false) MultipartFile picture) {
        playerService.updatePlayerWithPicture(id, firstName, lastName, dateOfBirth, nickname, positionId, countryId, value, picture);
        return ResponseEntity.ok("Player updated successfully");
    }

    @GetMapping("/search")
    @PermitAll
    public ResponseEntity<List<Player>> searchPlayers(@RequestParam("query") String query) {
        List<Player> players = playerService.searchPlayers(query);
        return ResponseEntity.ok(players);
    }

    //    @PostMapping("/import")
//    @PreAuthorize("hasRole('MODERATOR')")
//    public ResponseEntity<?> importPlayers(@RequestParam("file") MultipartFile file, @RequestParam("type") String fileType) {
//        try {
//            DataImporter importer = importerFactory.getImporterPlayer(fileType);
//            List<PlayerRequest> playerRequests = importer.importData(file.getInputStream());
//
//            String message = playerService.addPlayers(playerRequests);
//            return ResponseEntity.ok(message);
//        } catch (IOException e) {
//            return ResponseEntity.status(500).body("Error importing players: " + e.getMessage());
//        }
//    }
    @PostMapping("/import")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<String> importPlayers(@RequestParam("file") MultipartFile file, @RequestParam("type") String fileType) {
        String message = playerService.importPlayers(file, fileType, importerFactory);
        return ResponseEntity.ok(message);
    }

    //    @PostMapping("/{id}/uploadPhoto")
//    @PreAuthorize("hasRole('MODERATOR')")
//    public ResponseEntity<?> uploadPlayerPhoto(@PathVariable Long id, @RequestParam("photo") MultipartFile photo) {
//        try {
//            String filename = "player_" + id;
//            String filepath = fileStorageService.saveImage(photo, filename,"player");
//            playerService.updatePlayerPhotoPath(id, filepath);
//            return ResponseEntity.ok("Photo uploaded successfully.");
//        } catch (IOException e) {
//            return ResponseEntity.status(500).body("Error saving photo: " + e.getMessage());
//        }
//    }
//
//
//    @GetMapping("/{id}/photo")
//    public ResponseEntity<Resource> getPlayerPhoto(@PathVariable Long id) {
//        try {
//            // Spróbuj najpierw z rozszerzeniem jpg
//            String filename = "player_" + id + ".jpg";
//            Resource resource = fileStorageService.loadImageAsResource(filename);
//
//            // Jeśli plik jpg nie istnieje, spróbuj z png
//            if (!resource.exists()) {
//                filename = "player_" + id + ".png";
//                resource = fileStorageService.loadImageAsResource(filename);
//            }
//
//            // Jeśli żadne z rozszerzeń nie istnieje, zwróć 404
//            if (!resource.exists()) {
//                return ResponseEntity.notFound().build();
//            }
//
//            return ResponseEntity.ok()
//                    .contentType(Files.probeContentType(resource.getFile().toPath()).equals("image/png") ? MediaType.IMAGE_PNG : MediaType.IMAGE_JPEG)
//                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
//                    .body(resource);
//        } catch (Exception e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
    @GetMapping("/by-team/{teamId}")
    @PermitAll
    public ResponseEntity<List<Player>> getPlayersByTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(playerService.getPlayersByTeam(teamId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> deletePlayer(@PathVariable Long id) {
        return playerService.deletePlayer(id);
    }

    @GetMapping("/{id}")
    @PermitAll
    public ResponseEntity<Player> getPlayerById(@PathVariable Long id) {
        return ResponseEntity.ok(playerService.getPlayerById(id));
    }
}
