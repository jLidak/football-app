package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.MatchStatus;
import pl.pollub.footballapp.model.Match;
import pl.pollub.footballapp.repository.MatchRepository;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class MatchStatusUpdater {
    private final MatchRepository matchRepository;

    @Autowired
    public MatchStatusUpdater(MatchRepository matchRepository) {
        this.matchRepository = matchRepository;
    }


    // every 15 minutes (in ms:  15*60*1000=900000)
    @Scheduled(fixedRate = 900000)
    public void updateMatchStatuses() {
        LocalDateTime now = LocalDateTime.now();

        // UPCOMING & IN_PLAY matches
        List<Match> matches = matchRepository.findByStatusIn(List.of(MatchStatus.UPCOMING, MatchStatus.IN_PLAY));

//        for (Match match : matches) {
//            if (now.isBefore(match.getDateTime())) {
//                match.setStatus(MatchStatus.UPCOMING);
//            } else if (now.isBefore(match.getDateTime().plus(match.getDuration(), ChronoUnit.MINUTES))) {
//                match.setStatus(MatchStatus.IN_PLAY);
//            } else {
//                match.setStatus(MatchStatus.FINISHED);
//            }
//        }
//        matchRepository.saveAll(matches);
    }
}