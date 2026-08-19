package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.Position;
import pl.pollub.footballapp.repository.PositionRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/positions")
public class PositionController {
    private PositionRepository positionRepository;

    @Autowired
    public PositionController(PositionRepository positionRepository) {
        this.positionRepository = positionRepository;
    }


    // Endpoint do pobrania wszystkich pozycji
    @GetMapping
    public ResponseEntity<List<Position>> getAllPositions() {
        List<Position> positions = positionRepository.findAll();
        return ResponseEntity.ok(positions);
    }

    // Endpoint do dodania nowej pozycji
    @PostMapping("/add")
    public ResponseEntity<Position> addPosition(@RequestBody Position position) {
        Position savedPosition = positionRepository.save(position);
        return ResponseEntity.ok(savedPosition);
    }

    // Endpoint do pobrania pozycji po ID
    @GetMapping("/{id}")
    public ResponseEntity<Position> getPositionById(@PathVariable Long id) {
        Optional<Position> position = positionRepository.findById(id);
        return position.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Endpoint do wyszukiwania pozycji po nazwie
    @GetMapping("/search")
    public ResponseEntity<List<Position>> searchPositionsByName(@RequestParam("query") String query) {
        List<Position> positions = positionRepository.findByNameContainingIgnoreCase(query);
        return ResponseEntity.ok(positions);
    }
}
