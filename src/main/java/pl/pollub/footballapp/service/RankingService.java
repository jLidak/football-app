package pl.pollub.footballapp.service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.Ranking;
import pl.pollub.footballapp.repository.RankingRepository;
import pl.pollub.footballapp.requests.RankingRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;


import java.util.List;

@Service
public class RankingService {
    private final RankingRepository rankingRepository;

    @Autowired
    public RankingService(RankingRepository rankingRepository) {
        this.rankingRepository = rankingRepository;
    }


    public List<Ranking> getAllRankings() {
        return rankingRepository.findAll();
    }

//    public Ranking createRanking(String name, LocalDate startDate, LocalDate endDate) {
//        Ranking ranking = new Ranking();
//        ranking.setName(name);
//        ranking.setStartDate(startDate);
//        ranking.setEndDate(endDate);
//        return rankingRepository.save(ranking);
//    }

    public ResponseEntity<?> createRanking(RankingRequest rankingRequest) {
        Ranking ranking = new Ranking();
        ranking.setName(rankingRequest.getName());
        ranking.setStartDate(rankingRequest.getStartDate());
        ranking.setEndDate(rankingRequest.getEndDate());
        rankingRepository.save(ranking);
        return ResponseEntity.ok("Ranking added successfully");
    }

    public Ranking getRankingById(Long rankingId) {
        return rankingRepository.findById(rankingId)
                .orElseThrow(() -> new EntityNotFoundException("Ranking not found with ID: " + rankingId));
    }

    public void updateRanking(Long rankingId, RankingRequest rankingRequest) {
        Ranking ranking = rankingRepository.findById(rankingId)
                .orElseThrow(() -> new EntityNotFoundException("Ranking not found with ID: " + rankingId));

        ranking.setName(rankingRequest.getName());
        ranking.setStartDate(rankingRequest.getStartDate());
        ranking.setEndDate(rankingRequest.getEndDate());
        rankingRepository.save(ranking);
    }

}

