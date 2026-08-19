package pl.pollub.footballapp.service;

import io.micrometer.common.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.Referee;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.repository.RefereeRepository;
import pl.pollub.footballapp.requests.RefereeRequest;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class RefereeService {
    private RefereeRepository refereeRepository;
    private CountryRepository countryRepository;
    private ImporterFactory importerFactory;

    @Autowired
    public RefereeService(RefereeRepository refereeRepository, CountryRepository countryRepository, ImporterFactory importerFactory) {
        this.refereeRepository = refereeRepository;
        this.countryRepository = countryRepository;
        this.importerFactory = importerFactory;
    }


    public ResponseEntity<?> addReferee(RefereeRequest refereeRequest) {
        Country country = countryRepository.findByName(refereeRequest.getCountryName())
                .orElseThrow(() -> new RuntimeException("Country not found"));

        boolean duplicateExists;
        if (StringUtils.isEmpty(refereeRequest.getDateOfBirth())) {
            // Check for duplicates without a date of birth
            duplicateExists = refereeRepository.existsByFirstNameAndLastNameAndCountry(
                    refereeRequest.getFirstName(),
                    refereeRequest.getLastName(),
                    country
            );
        } else {
            // Check for duplicates with a date of birth
            duplicateExists = refereeRepository.existsByFirstNameAndLastNameAndDateOfBirthAndCountry(
                    refereeRequest.getFirstName(),
                    refereeRequest.getLastName(),
                    LocalDate.parse(refereeRequest.getDateOfBirth()),
                    country
            );
        }

        if (duplicateExists) {
            return ResponseEntity.badRequest().body("Referee already exists");
        }

        Referee referee = new Referee();
        referee.setFirstName(refereeRequest.getFirstName());
        referee.setLastName(refereeRequest.getLastName());
        if (StringUtils.isNotEmpty(refereeRequest.getDateOfBirth())) {
            referee.setDateOfBirth(LocalDate.parse(refereeRequest.getDateOfBirth()));
        }
        referee.setCountry(country);

        refereeRepository.save(referee);
        return ResponseEntity.ok("Referee added successfully");
    }

    public ResponseEntity<?> importReferees(MultipartFile file, String fileType) throws IOException {
        DataImporter importer = importerFactory.getImporterReferee(fileType);
        List<RefereeRequest> refereeRequests = importer.importData(file.getInputStream());

        List<Integer> duplicateRows = new ArrayList<>();
        int rowNumber = 1;

        for (RefereeRequest refereeRequest : refereeRequests) {
            Country country = countryRepository.findByName(refereeRequest.getCountryName())
                    .orElseThrow(() -> new RuntimeException("Country not found: " + refereeRequest.getCountryName()));

            boolean isDuplicate;
            if (StringUtils.isNotEmpty(refereeRequest.getDateOfBirth())) {
                // Check if a referee exists with the same name, country, and dateOfBirth
                isDuplicate = refereeRepository.existsByFirstNameAndLastNameAndDateOfBirthAndCountry(
                        refereeRequest.getFirstName(),
                        refereeRequest.getLastName(),
                        LocalDate.parse(refereeRequest.getDateOfBirth()),
                        country
                );
            } else {
                // Check if a referee exists with the same name, country, and no dateOfBirth
                isDuplicate = refereeRepository.existsByFirstNameAndLastNameAndCountryAndDateOfBirthIsNull(
                        refereeRequest.getFirstName(),
                        refereeRequest.getLastName(),
                        country
                );
            }

            if (!isDuplicate) {
                Referee referee = new Referee();
                referee.setFirstName(refereeRequest.getFirstName());
                referee.setLastName(refereeRequest.getLastName());
                if (StringUtils.isNotEmpty(refereeRequest.getDateOfBirth())) {
                    referee.setDateOfBirth(LocalDate.parse(refereeRequest.getDateOfBirth()));
                }
                referee.setCountry(country);
                refereeRepository.save(referee);
            } else {
                duplicateRows.add(rowNumber);
            }

            rowNumber++;
        }

        String message = "Referees imported successfully.";
        if (!duplicateRows.isEmpty()) {
            message += " The following records were not added due to duplicates: " + duplicateRows.toString();
        }

        return ResponseEntity.ok(message);
    }

    public ResponseEntity<List<Referee>> searchReferees(String query) {
        Sort sortById = Sort.by(Sort.Direction.ASC, "id");
        String normalizedQuery = query.trim().toLowerCase();
        List<Referee> referees = refereeRepository.findByFullNameContaining(normalizedQuery, sortById);
        return ResponseEntity.ok(referees);
    }

    public ResponseEntity<?> updateReferee(Long id, RefereeRequest updatedRequest) {
        Referee referee = refereeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Referee not found"));

        Country country = countryRepository.findByName(updatedRequest.getCountryName())
                .orElseThrow(() -> new RuntimeException("Country not found"));

        referee.setFirstName(updatedRequest.getFirstName());
        referee.setLastName(updatedRequest.getLastName());
        referee.setDateOfBirth(LocalDate.parse(updatedRequest.getDateOfBirth()));
        referee.setCountry(country);

        refereeRepository.save(referee);
        return ResponseEntity.ok("Referee updated successfully");
    }

    public ResponseEntity<?> deleteReferee(Long id) {
        if (refereeRepository.existsById(id)) {
            refereeRepository.deleteById(id);
            return ResponseEntity.ok("Referee deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Referee not found");
        }
    }

    public List<Referee> getAllReferees() {
        return refereeRepository.findAll();
    }
}
