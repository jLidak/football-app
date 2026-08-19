package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.City;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.repository.CityRepository;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.requests.CityRequest;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;

import java.io.IOException;
import java.util.*;

@Service
public class CityService {
    private CityRepository cityRepository;
    private CountryRepository countryRepository;
    private ImporterFactory importerFactory;

    @Autowired
    public CityService(CityRepository cityRepository, CountryRepository countryRepository, ImporterFactory importerFactory) {
        this.cityRepository = cityRepository;
        this.countryRepository = countryRepository;
        this.importerFactory = importerFactory;
    }


    public ResponseEntity<?> addCity(City cityRequest) {
        Optional<Country> country = countryRepository.findByName(cityRequest.getCountry().getName());

        if (country.isEmpty()) {
            return ResponseEntity.badRequest().body("Country not found");
        }

        if (cityRepository.existsByNameAndCountry(cityRequest.getName(), country.get())) {
            return ResponseEntity.badRequest().body("City already exists in this country");
        }

        City city = new City();
        city.setName(cityRequest.getName());
        city.setCountry(country.get());

        cityRepository.save(city);
        return ResponseEntity.ok("City added successfully");
    }

    public ResponseEntity<?> importCities(MultipartFile file, String fileType) throws IOException {
        DataImporter importer = importerFactory.getImporterCity(fileType);
        List<CityRequest> cityRequests = importer.importData(file.getInputStream());

        List<Integer> duplicateIndices = new ArrayList<>();  // Track indices of duplicate records

        for (int i = 0; i < cityRequests.size(); i++) {
            CityRequest cityRequest = cityRequests.get(i);
            Optional<Country> countryOptional = countryRepository.findByName(cityRequest.getCountryName());

            if (countryOptional.isEmpty()) {
                throw new IllegalArgumentException("Country not found: " + cityRequest.getCountryName());
            }

            Country country = countryOptional.get();

            // Check for duplicates in the database
            boolean cityExists = cityRepository.existsByNameAndCountry(cityRequest.getName(), country);
            if (cityExists) {
                duplicateIndices.add(i + 1);  // Add 1 to make indices user-friendly (1-based index)
                continue;  // Skip adding this city
            }

            // Save new city
            City city = new City();
            city.setName(cityRequest.getName());
            city.setCountry(country);
            cityRepository.save(city);
        }

        // Prepare response message with duplicate indices
        String message = "Cities imported successfully.";
        if (!duplicateIndices.isEmpty()) {
            message += " Skipped records at positions: " + duplicateIndices.toString();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("duplicates", duplicateIndices);

        return ResponseEntity.ok(response);
    }


    //
    public ResponseEntity<List<City>> searchCities(String query) {
        List<City> cities = (List<City>) cityRepository.findByNameContaining(query);
        return ResponseEntity.ok(cities);
    }
//
//    public ResponseEntity<?> searchCities(@RequestParam("query") String query) {
//        return ResponseEntity.ok(cityRepository.findByNameContaining(query));
//    }
}
