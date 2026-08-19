package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.Injury;
import pl.pollub.footballapp.model.Player;
import pl.pollub.footballapp.repository.InjuryRepository;
import pl.pollub.footballapp.repository.PlayerRepository;
import pl.pollub.footballapp.requests.InjuryRequest;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class InjuryService {
    private InjuryRepository injuryRepository;
    private PlayerRepository playerRepository;
    private ImporterFactory importerFactory;

    @Autowired
    public InjuryService(InjuryRepository injuryRepository, PlayerRepository playerRepository, ImporterFactory importerFactory) {
        this.injuryRepository = injuryRepository;
        this.playerRepository = playerRepository;
        this.importerFactory = importerFactory;
    }


    public ResponseEntity<?> addInjury(InjuryRequest injuryRequest) {
        Player player = playerRepository.findById(injuryRequest.getPlayerId())
                .orElseThrow(() -> new RuntimeException("Player not found"));

        if (injuryRepository.existsOverlappingInjury(
                player.getId(),
                injuryRequest.getType(),
                injuryRequest.getStartDate(),
                injuryRequest.getEndDate())) {
            return ResponseEntity.badRequest().body("Overlapping injury already exists for this player");
        }

        Injury injury = new Injury();
        injury.setType(injuryRequest.getType());
        injury.setStartDate(injuryRequest.getStartDate());
        injury.setEndDate(injuryRequest.getEndDate());
        injury.setPlayer(player);

        injuryRepository.save(injury);
        return ResponseEntity.ok("Injury added successfully");
    }


    public ResponseEntity<?> importInjuries(MultipartFile file, String fileType) throws IOException {
        DataImporter importer = importerFactory.getImporterInjury(fileType);
        List<InjuryRequest> injuryRequests = importer.importData(file.getInputStream());

        List<Integer> duplicateRows = new ArrayList<>();
        int rowNumber = 1;

        for (InjuryRequest injuryRequest : injuryRequests) {
            Optional<Player> player = playerRepository.findById(injuryRequest.getPlayerId());

            if (player.isEmpty()) {
                duplicateRows.add(rowNumber);
                continue;
            }

            // Check for overlapping injuries
            if (injuryRepository.existsOverlappingInjury(
                    player.get().getId(),
                    injuryRequest.getType(),
                    injuryRequest.getStartDate(),
                    injuryRequest.getEndDate())) {
                duplicateRows.add(rowNumber);
            } else {
                Injury injury = new Injury();
                injury.setType(injuryRequest.getType());
                injury.setStartDate(injuryRequest.getStartDate());
                injury.setEndDate(injuryRequest.getEndDate());
                injury.setPlayer(player.get());
                injuryRepository.save(injury);
            }

            rowNumber++;
        }

        String message = "Injuries imported successfully.";
        if (!duplicateRows.isEmpty()) {
            message += " Skipped records at positions: " + duplicateRows;
        }

        return ResponseEntity.ok(message);
    }

    public List<Injury> getInjuriesByPlayerId(Long playerId) {
        return injuryRepository.findByPlayerId(playerId);
    }

    public ResponseEntity<?> editInjury(Long id, InjuryRequest updatedInjury) {
        Injury injury = injuryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Injury not found"));

        Player player = playerRepository.findById(updatedInjury.getPlayerId())
                .orElseThrow(() -> new RuntimeException("Player not found"));

        injury.setType(updatedInjury.getType());
        injury.setStartDate(updatedInjury.getStartDate());

        // Update endDate only if it is provided
        if (updatedInjury.getEndDate() != null) {
            injury.setEndDate(updatedInjury.getEndDate());
        } else {
            injury.setEndDate(null); // Set to null if endDate is not provided
        }

        injury.setPlayer(player);
        injuryRepository.save(injury);
        return ResponseEntity.ok("Injury updated successfully");
    }

    public ResponseEntity<?> deleteInjury(Long injuryId) {
        if (!injuryRepository.existsById(injuryId)) {
            return ResponseEntity.status(404).body("Injury not found");
        }
        injuryRepository.deleteById(injuryId);
        return ResponseEntity.ok("Injury deleted successfully");
    }
}
