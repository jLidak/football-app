package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.Stadium;
import pl.pollub.footballapp.requests.StadiumRequest;
import pl.pollub.footballapp.service.StadiumService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/stadiums")
@CrossOrigin(origins = "http://localhost:3000")
public class StadiumController {
    private StadiumService stadiumService;

    @Autowired
    public StadiumController(StadiumService stadiumService) {
        this.stadiumService = stadiumService;
    }


    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addStadium(@RequestBody StadiumRequest stadiumRequest) {
        return stadiumService.addStadium(stadiumRequest);
    }

    @PostMapping("/import")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> importStadiums(@RequestParam("file") MultipartFile file, @RequestParam("type") String fileType) {
        try {
            return stadiumService.importStadiums(file, fileType);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error importing stadiums: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Stadium>> searchStadiums(@RequestParam("query") String query) {
        return stadiumService.searchStadiums(query);
    }
//    @GetMapping("/search")
//    @PreAuthorize("hasRole('MODERATOR')")
//    public ResponseEntity<List<Stadium>> searchStadiums(@RequestParam(required = false) String query) {
//        List<Stadium> stadiums;
//        if (query == null || query.isEmpty()) {
//            stadiums = stadiumService.getAllStadiums();  // Zwraca wszystkie stadiony, jeśli query jest puste
//        } else {
//            stadiums = (List<Stadium>) stadiumService.searchStadiums(query);
//            //stadiums = stadiumService.searchStadiums(query);
//        }
//        return ResponseEntity.ok(stadiums);
//    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> updateStadium(@PathVariable Long id, @RequestBody StadiumRequest updatedStadiumRequest) {
        return stadiumService.updateStadium(id, updatedStadiumRequest);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> deleteStadium(@PathVariable Long id) {
        return stadiumService.deleteStadium(id);
    }

}
