package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.RankingPoints;
import pl.pollub.footballapp.service.RankingPointsService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ranking-points")
public class RankingPointsController {
    private final RankingPointsService rankingPointsService;

    @Autowired
    public RankingPointsController(RankingPointsService rankingPointsService) {
        this.rankingPointsService = rankingPointsService;
    }


    //    @GetMapping("/{rankingId}")
//    public ResponseEntity<List<Map<String, Object>>> getRankingPointsByRankingId(@PathVariable Long rankingId) {
//        List<RankingPoints> points = rankingPointsService.getRankingPointsByRankingId(rankingId);
//
//        List<Map<String, Object>> response = points.stream().map(point -> {
//            Map<String, Object> map = new HashMap<>();
//            map.put("userName", point.getUser().getUsername());
//            map.put("points", point.getPoints());
//            return map;
//        }).collect(Collectors.toList());
//
//        return ResponseEntity.ok(response);
//    }
    @GetMapping("/{rankingId}")
    public ResponseEntity<List<Map<String, Object>>> getRankingPointsByRankingId(@PathVariable Long rankingId) {
        List<Map<String, Object>> response = rankingPointsService.getRankingPointsMappedByRankingId(rankingId);
        return ResponseEntity.ok(response);
    }


//    @PutMapping("/update")
//    public ResponseEntity<RankingPoints> updateRankingPoints(
//            @RequestParam Long userId,
//            @RequestParam Long rankingId,
//            @RequestParam int additionalPoints) {
//        RankingPoints updatedPoints = rankingPointsService.updateRankingPoints(userId, rankingId, additionalPoints);
//        return ResponseEntity.ok(updatedPoints);
//    }

}
