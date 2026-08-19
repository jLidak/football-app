package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.City;
import pl.pollub.footballapp.requests.CityRequest;
import pl.pollub.footballapp.service.CityService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/cities")
public class CityController {
    private CityService cityService;

    @Autowired
    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addCity(@RequestBody City cityRequest) {
        return cityService.addCity(cityRequest);
    }

    @GetMapping("/search")
    public ResponseEntity<List<City>> searchCities(@RequestParam("query") String query) {
        return cityService.searchCities(query);
    }

    @PostMapping("/import")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> importCities(@RequestParam("file") MultipartFile file, @RequestParam("type") String fileType) {
        try {
            return cityService.importCities(file, fileType);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error importing cities: " + e.getMessage());
        }
    }
}
