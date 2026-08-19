package pl.pollub.footballapp.service;

import io.micrometer.common.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.Coach;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.repository.CoachRepository;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.requests.CoachRequest;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CoachService {
    private CoachRepository coachRepository;
    private CountryRepository countryRepository;
    private ImporterFactory importerFactory;

    @Autowired
    public CoachService(CoachRepository coachRepository, CountryRepository countryRepository, ImporterFactory importerFactory) {
        this.coachRepository = coachRepository;
        this.countryRepository = countryRepository;
        this.importerFactory = importerFactory;
    }


    public ResponseEntity<?> addCoach(Coach coachRequest) {
        Optional<Country> country = countryRepository.findByName(coachRequest.getCountry().getName());

        if (country.isEmpty()) {
            return ResponseEntity.badRequest().body("Country not found");
        }

        boolean duplicateExists;
        if (coachRequest.getDateOfBirth() == "null") {
            duplicateExists = coachRepository.existsByFirstNameAndLastNameAndCountry(
                    coachRequest.getFirstName(),
                    coachRequest.getLastName(),
                    country.get()
            );
        } else {
            duplicateExists = coachRepository.existsByFirstNameAndLastNameAndDateOfBirthAndCountry(
                    coachRequest.getFirstName(),
                    coachRequest.getLastName(),
                    LocalDate.parse(coachRequest.getDateOfBirth()),
                    country.get()
            );
        }

        // Check for duplicate without date of birth


        if (duplicateExists) {
            return ResponseEntity.badRequest().body("Coach already exists");
        }

        Coach coach = new Coach();
        coach.setFirstName(coachRequest.getFirstName());
        coach.setLastName(coachRequest.getLastName());
        // Parse date of birth only if it is provided
        if (!(coachRequest.getDateOfBirth() == "null")) {
            coach.setDateOfBirth(LocalDate.parse(coachRequest.getDateOfBirth()));
        }
        coach.setNickname(coachRequest.getNickname());
        coach.setCountry(country.get());

        coachRepository.save(coach);
        return ResponseEntity.ok("Coach added successfully");
    }

    public ResponseEntity<?> importCoaches(MultipartFile file, String fileType) throws IOException {
        DataImporter importer = importerFactory.getImporterCoach(fileType);
        List<CoachRequest> coachRequests = importer.importData(file.getInputStream());

        List<Integer> duplicateRows = new ArrayList<>();
        int rowNumber = 1;

        for (CoachRequest coachRequest : coachRequests) {
            Country country = countryRepository.findByName(coachRequest.getCountryName())
                    .orElseThrow(() -> new RuntimeException("Country not found: " + coachRequest.getCountryName()));

            boolean isDuplicate = false;

            if (StringUtils.isNotEmpty(coachRequest.getDateOfBirth())) {
                // Check if a coach exists with the same name, country, and dateOfBirth
                isDuplicate = coachRepository.existsByFirstNameAndLastNameAndDateOfBirthAndCountry(
                        coachRequest.getFirstName(),
                        coachRequest.getLastName(),
                        LocalDate.parse(coachRequest.getDateOfBirth()),
                        country
                );
            } else {
                // Check if a coach exists with the same name, country, and no dateOfBirth
                isDuplicate = coachRepository.existsByFirstNameAndLastNameAndCountryAndDateOfBirthIsNull(
                        coachRequest.getFirstName(),
                        coachRequest.getLastName(),
                        country
                );
            }

            if (!isDuplicate) {
                Coach coach = new Coach();
                coach.setFirstName(coachRequest.getFirstName());
                coach.setLastName(coachRequest.getLastName());
                if (StringUtils.isNotEmpty(coachRequest.getDateOfBirth())) {
                    coach.setDateOfBirth(LocalDate.parse(coachRequest.getDateOfBirth()));
                }
                coach.setNickname(coachRequest.getNickname());
                coach.setCountry(country);
                coachRepository.save(coach);
            } else {
                duplicateRows.add(rowNumber);
            }

            rowNumber++;
        }

        String message = "Coaches imported successfully.";
        if (!duplicateRows.isEmpty()) {
            message += " The following records were not added due to duplicates: " + duplicateRows.toString();
        }

        return ResponseEntity.ok(message);
    }

    public ResponseEntity<List<Coach>> searchCoaches(String query) {
        Sort sortById = Sort.by(Sort.Direction.ASC, "id");
        String normalizedQuery = query.trim().toLowerCase();
        List<Coach> coaches = coachRepository.findByFullNameOrNicknameContaining(normalizedQuery, sortById);
        return ResponseEntity.ok(coaches);
    }

    public ResponseEntity<?> updateCoach(Long id, CoachRequest coachRequest) {
        Coach coach = coachRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coach not found"));

        Country country = countryRepository.findByName(coachRequest.getCountryName())
                .orElseThrow(() -> new RuntimeException("Country not found"));

        coach.setFirstName(coachRequest.getFirstName());
        coach.setLastName(coachRequest.getLastName());
        coach.setDateOfBirth(LocalDate.parse(coachRequest.getDateOfBirth()));
        coach.setNickname(coachRequest.getNickname());
        coach.setCountry(country);

        coachRepository.save(coach);

        return ResponseEntity.ok("Coach updated successfully");
    }

    @Transactional
    public void deleteCoachById(Long id) {
        Coach coach = coachRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coach not found"));
        coachRepository.delete(coach);
    }

    public Coach getCoachById(Long id) {
        return coachRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coach not found with ID: " + id));
    }

    public List<Coach> searchCoachesByName(String name) {
        return coachRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name);
    }
}
