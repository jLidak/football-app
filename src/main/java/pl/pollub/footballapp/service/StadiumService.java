package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.City;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.model.Stadium;
import pl.pollub.footballapp.repository.CityRepository;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.repository.StadiumRepository;
import pl.pollub.footballapp.requests.StadiumRequest;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;

import java.io.IOException;
import java.util.*;

@Service
public class StadiumService {
    private StadiumRepository stadiumRepository;
    private CityRepository cityRepository;
    private CountryRepository countryRepository;
    private ImporterFactory importerFactory;

    @Autowired
    public StadiumService(StadiumRepository stadiumRepository, CityRepository cityRepository, CountryRepository countryRepository, ImporterFactory importerFactory) {
        this.stadiumRepository = stadiumRepository;
        this.cityRepository = cityRepository;
        this.countryRepository = countryRepository;
        this.importerFactory = importerFactory;
    }


    public ResponseEntity<?> addStadium(StadiumRequest stadiumRequest) {
        Country country = countryRepository.findByName(stadiumRequest.getCountryName())
                .orElseThrow(() -> new RuntimeException("Country not found"));

        City city = cityRepository.findByNameAndCountryName(stadiumRequest.getCityName(), stadiumRequest.getCountryName())
                .orElseThrow(() -> new RuntimeException("City not found"));

        boolean stadiumExists = stadiumRepository.existsByNameAndCity(stadiumRequest.getName(), city);
        if (stadiumExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Stadium already exists.");
        }

        Stadium stadium = new Stadium();
        stadium.setName(stadiumRequest.getName());
        stadium.setCapacity(stadiumRequest.getCapacity());
        stadium.setCity(city);

        stadiumRepository.save(stadium);
        return ResponseEntity.ok("Stadium added successfully");
    }

    public ResponseEntity<?> importStadiums(MultipartFile file, String fileType) throws IOException {
        DataImporter importer = importerFactory.getImporter(fileType);
        List<StadiumRequest> stadiumRequests = importer.importData(file.getInputStream());

        List<Integer> duplicateIndices = new ArrayList<>();  // Track indices of duplicate records

        for (int i = 0; i < stadiumRequests.size(); i++) {
            StadiumRequest stadiumRequest = stadiumRequests.get(i);

            // Find city by name and country name
            Optional<City> cityOptional = cityRepository.findByNameAndCountryName(stadiumRequest.getCityName(), stadiumRequest.getCountryName());
            if (cityOptional.isEmpty()) {
                // If the city or country doesn't exist, skip this record and move to the next
                System.out.println("City or country not found for: " + stadiumRequest.getCityName() + ", " + stadiumRequest.getCountryName() + " - skipping record.");
                continue;
            }

            City city = cityOptional.get();

            // Check if the stadium already exists in the database
            boolean stadiumExists = stadiumRepository.existsByNameAndCity(stadiumRequest.getName(), city);
            if (stadiumExists) {
                duplicateIndices.add(i + 1);  // Record 1-based index of duplicate
                continue;  // Skip adding this stadium to the database
            }

            // Add new stadium if it is not a duplicate
            Stadium stadium = new Stadium();
            stadium.setName(stadiumRequest.getName());
            stadium.setCapacity(stadiumRequest.getCapacity());
            stadium.setCity(city);

            stadiumRepository.save(stadium);  // Save to database
        }

        // Prepare response message with duplicate indices
        String message = "Stadiums imported successfully.";
        if (!duplicateIndices.isEmpty()) {
            message += " Skipped records at positions: " + duplicateIndices.toString();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("duplicates", duplicateIndices);

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<List<Stadium>> searchStadiums(String query) {
        Sort sortById = Sort.by(Sort.Direction.ASC, "id");
        String normalizedQuery = query.trim().toLowerCase();
        List<Stadium> stadiums = stadiumRepository.findByNameContainingOrCityNameContaining(normalizedQuery, sortById);
        return ResponseEntity.ok(stadiums);
    }

    public ResponseEntity<?> updateStadium(Long id, StadiumRequest updatedStadiumRequest) {
        Stadium stadium = stadiumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stadium not found"));

        City city = cityRepository.findByNameAndCountryName(updatedStadiumRequest.getCityName(), updatedStadiumRequest.getCountryName())
                .orElseThrow(() -> new RuntimeException("City not found"));

        stadium.setName(updatedStadiumRequest.getName());
        stadium.setCapacity(updatedStadiumRequest.getCapacity());
        stadium.setCity(city);

        stadiumRepository.save(stadium);
        return ResponseEntity.ok("Stadium updated successfully");
    }

    public ResponseEntity<?> deleteStadium(Long id) {
        if (stadiumRepository.existsById(id)) {
            stadiumRepository.deleteById(id);
            return ResponseEntity.ok("Stadium deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Stadium not found");
        }
    }

    public List<Stadium> getAllStadiums() {
        return stadiumRepository.findAll();
    }
}
