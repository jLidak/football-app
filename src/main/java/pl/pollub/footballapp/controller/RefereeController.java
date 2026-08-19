package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.requests.RefereeRequest;
import pl.pollub.footballapp.model.Referee;
import pl.pollub.footballapp.service.RefereeService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/referees")
@CrossOrigin(origins = "http://localhost:3000")
public class RefereeController {
    private RefereeService refereeService;

    @Autowired
    public RefereeController(RefereeService refereeService) {
        this.refereeService = refereeService;
    }


    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addReferee(@RequestBody RefereeRequest refereeRequest) {
        return refereeService.addReferee(refereeRequest);
    }

    @PostMapping("/import")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> importReferees(@RequestParam("file") MultipartFile file, @RequestParam("type") String fileType) {
        try {
            return refereeService.importReferees(file, fileType);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error importing referees: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Referee>> searchReferees(@RequestParam("query") String query) {
        return refereeService.searchReferees(query);
    }
//    @GetMapping("/search")
//    @PreAuthorize("hasRole('MODERATOR')")
//    public ResponseEntity<List<Referee>> searchReferees(@RequestParam(required = false) String query) {
//        List<Referee> referees;
//        if (query == null || query.isEmpty()) {
//            referees = refereeService.getAllReferees();
//        } else {
//            referees = (List<Referee>) refereeService.searchReferees(query);
//            //referees = refereeService.searchReferees(query);
//        }
//        return ResponseEntity.ok(referees);
//    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> updateReferee(@PathVariable Long id, @RequestBody RefereeRequest updatedRequest) {
        return refereeService.updateReferee(id, updatedRequest);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> deleteReferee(@PathVariable Long id) {
        return refereeService.deleteReferee(id);
    }
}
