package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.requests.InjuryRequest;
import pl.pollub.footballapp.model.Injury;
import pl.pollub.footballapp.service.InjuryService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/injuries")
public class InjuryController {
    private InjuryService injuryService;

    @Autowired
    public InjuryController(InjuryService injuryService) {
        this.injuryService = injuryService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addInjury(@RequestBody InjuryRequest injuryRequest) {
        return injuryService.addInjury(injuryRequest);
    }

    @GetMapping("/player/{playerId}")
    public List<Injury> getInjuriesByPlayerId(@PathVariable Long playerId) {
        return injuryService.getInjuriesByPlayerId(playerId);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> editInjury(@PathVariable Long id, @RequestBody InjuryRequest updatedInjury) {
        return injuryService.editInjury(id, updatedInjury);
    }

    @PostMapping("/import")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> importInjuries(@RequestParam("file") MultipartFile file, @RequestParam("type") String fileType) throws IOException {
        return injuryService.importInjuries(file, fileType);
    }

    @DeleteMapping("/{injuryId}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> deleteInjury(@PathVariable Long injuryId) {
        return injuryService.deleteInjury(injuryId);
    }


}
