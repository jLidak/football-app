package pl.pollub.footballapp.service;

import aj.org.objectweb.asm.commons.Remapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.League;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.model.Team;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.repository.LeagueRepository;
import pl.pollub.footballapp.requests.LeagueRequest;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;

import java.io.IOException;
import java.util.*;

@Service
public class LeagueService {
    private LeagueRepository leagueRepository;
    private CountryRepository countryRepository;
    private ImporterFactory importerFactory;

    @Autowired
    public LeagueService(LeagueRepository leagueRepository, CountryRepository countryRepository, ImporterFactory importerFactory) {
        this.leagueRepository = leagueRepository;
        this.countryRepository = countryRepository;
        this.importerFactory = importerFactory;
    }


    public ResponseEntity<?> addLeague(LeagueRequest leagueRequest) {
        Country country = countryRepository.findByName(leagueRequest.getCountryName())
                .orElseThrow(() -> new RuntimeException("Country not found"));

        // Sprawdź, czy istnieje liga z tą samą nazwą, krajem i edycją
        boolean leagueExists = leagueRepository.existsByNameAndCountryAndEdition(
                leagueRequest.getName(), country, leagueRequest.getEdition());

        if (leagueExists) {
            return ResponseEntity.badRequest().body("League with the same name, country, and edition already exists");
        }

        // Utwórz i zapisz nową ligę
        League league = new League();
        league.setName(leagueRequest.getName());
        league.setCountry(country);
        league.setEdition(leagueRequest.getEdition());

        leagueRepository.save(league);
        return ResponseEntity.ok("League added successfully");
    }


    public ResponseEntity<?> importLeagues(MultipartFile file, String fileType) throws IOException {
        DataImporter importer = importerFactory.getImporterLeague(fileType);
        List<LeagueRequest> leagueRequests = importer.importData(file.getInputStream());

        List<Integer> duplicateIndices = new ArrayList<>();  // Track indices of duplicate records

        for (int i = 0; i < leagueRequests.size(); i++) {
            LeagueRequest leagueRequest = leagueRequests.get(i);
            Optional<Country> countryOptional = countryRepository.findByName(leagueRequest.getCountryName());

            if (countryOptional.isEmpty()) {
                throw new IllegalArgumentException("Country not found: " + leagueRequest.getCountryName());
            }

            Country country = countryOptional.get();

            boolean leagueExists = leagueRepository.existsByNameAndCountryAndEdition(
                    leagueRequest.getName(), country, leagueRequest.getEdition());
            if (leagueExists) {
                duplicateIndices.add(i + 1);  // Dodaj do listy duplikatów
                continue;  // Pomijaj dodanie tej ligi
            }

            League league = new League();
            league.setName(leagueRequest.getName());
            league.setCountry(country);
            league.setEdition(leagueRequest.getEdition());
            leagueRepository.save(league);
        }

        String message = "Leagues imported successfully.";
        if (!duplicateIndices.isEmpty()) {
            message += " Skipped records at positions: " + duplicateIndices.toString();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("duplicates", duplicateIndices);

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<List<League>> searchLeagues(String query) {
        Sort sortById = Sort.by(Sort.Direction.ASC, "id");
        String normalizedQuery = query.trim().toLowerCase();
        List<League> leagues = leagueRepository.findByNameContaining(normalizedQuery, sortById);
        return ResponseEntity.ok(leagues);
    }

    public ResponseEntity<?> updateLeague(Long id, LeagueRequest updatedLeagueRequest) {
        League league = leagueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("League not found"));

        Country country = countryRepository.findByName(updatedLeagueRequest.getCountryName())
                .orElseThrow(() -> new RuntimeException("Country not found"));

        league.setName(updatedLeagueRequest.getName());
        league.setCountry(country);
        league.setEdition(updatedLeagueRequest.getEdition());

        leagueRepository.save(league);
        return ResponseEntity.ok("League updated successfully");
    }

    public ResponseEntity<?> deleteLeague(Long id) {
        if (leagueRepository.existsById(id)) {
            leagueRepository.deleteById(id);
            return ResponseEntity.ok("League deleted successfully");
        } else {
            return ResponseEntity.status(404).body("League not found");
        }
    }

    public List<League> getAllLeagues() {
        return leagueRepository.findAll();
    }


    public Optional<League> getLeagueById(Long id) {
        return leagueRepository.findById(id);
    }

    public League setWinner(Long leagueId, Team winner) {
        return leagueRepository.findById(leagueId)
                .map(league -> {
                    league.setWinner(winner);
                    return leagueRepository.save(league);
                })
                .orElseThrow(() -> new RuntimeException("League with ID " + leagueId + " not found"));
    }

    public Team getWinner(Long leagueId) {
        return leagueRepository.findById(leagueId)
                .map(League::getWinner)
                .orElseThrow(() -> new RuntimeException("League with ID " + leagueId + " not found"));
    }

    public Optional<League> findById(Long id) {
        return leagueRepository.findById(id);
    }


    public List<League> getLeaguesBySameName(Long leagueId) {
        // Pobierz ligę na podstawie ID
        League league = leagueRepository.findById(leagueId)
                .orElseThrow(() -> new IllegalArgumentException("League not found with ID: " + leagueId));

        String leagueName = league.getName(); // Pobierz nazwę ligi

        // Wyszukaj wszystkie ligi o tej samej nazwie
        List<League> leaguesWithSameName = leagueRepository.findByName(leagueName);

        return leaguesWithSameName;
    }
}
