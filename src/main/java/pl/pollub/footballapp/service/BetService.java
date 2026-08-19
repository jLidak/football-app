package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.pollub.footballapp.MatchStatus;
import pl.pollub.footballapp.model.*;
import pl.pollub.footballapp.repository.*;
import pl.pollub.footballapp.requests.BetRequest;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BetService {
    private BetRepository betRepository;
    private RankingPointsRepository rankingPointsRepository;
    private UserRepository userRepository;
    private MatchRepository matchRepository;
    private RankingRepository rankingRepository;
    private RankingPointsService rankingPointsService;
    private NotificationService notificationService;

    @Autowired
    public BetService(BetRepository betRepository, UserRepository userRepository, MatchRepository matchRepository, RankingRepository rankingRepository, RankingPointsService rankingPointsService, RankingPointsRepository rankingPointsRepository, NotificationService notificationService) {
        this.betRepository = betRepository;
        this.userRepository = userRepository;
        this.matchRepository = matchRepository;
        this.rankingRepository = rankingRepository;
        this.rankingPointsService = rankingPointsService;
        this.rankingPointsRepository = rankingPointsRepository;
        this.notificationService = notificationService;
    }


//    public Bet addBet(Bet bet) {
//        return betRepository.save(bet);
//    }
//public Bet addBet(Long matchId, int homeScore, int awayScore, Authentication authentication) {
//    // Pobierz nazwę użytkownika z kontekstu bezpieczeństwa
//    String username = authentication.getId();
//
//    User user = userRepository.findByUsername(username)
//            .orElseThrow(() -> new RuntimeException("User not found"));
//
//    Match match = matchRepository.findById(matchId)
//            .orElseThrow(() -> new RuntimeException("Match not found"));
//
//    // Sprawdź, czy użytkownik już obstawił ten mecz
//    if (betRepository.existsByUserAndMatch(user, match)) {
//        throw new RuntimeException("Bet already exists for this match");
//    }
//
//    Bet bet = new Bet();
//    bet.setUser(user);
//    bet.setMatch(match);
//    bet.setHomeScore(homeScore);
//    bet.setAwayScore(awayScore);
//    bet.setIsCorrect(null); // Na razie nie wiadomo, czy obstawienie jest poprawne
//    bet.setCreatedAt(LocalDateTime.now());
//
//    return betRepository.save(bet);
//}
//    public Bet addBet(Long matchId, int homeScore, int awayScore, Authentication authentication) {
//        // Pobierz nazwę użytkownika z kontekstu bezpieczeństwa
//        String username = authentication.getId();
//
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        Match match = matchRepository.findById(matchId)
//                .orElseThrow(() -> new RuntimeException("Match not found"));
//
//        // Sprawdź, czy użytkownik już obstawił ten mecz
//        if (betRepository.existsByUserAndMatch(user, match)) {
//            throw new RuntimeException("Bet already exists for this match");
//        }
//
//        Bet bet = new Bet();
//        bet.setUser(user);
//        bet.setMatch(match);
//        bet.setHomeScore(homeScore);
//        bet.setAwayScore(awayScore);
//        bet.setIsCorrect(null); // Na razie nie wiadomo, czy obstawienie jest poprawne
//        bet.setCreatedAt(LocalDateTime.now());
//
//        return betRepository.save(bet);
//    }

//    public Bet placeBet(Long userId, Long matchId, int homeScore, int awayScore) {
//        if (betRepository.existsByUserIdAndMatchId(userId, matchId)) {
//            throw new IllegalArgumentException("User has already placed a bet for this match.");
//        }
//
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new IllegalArgumentException("User not found"));
//        Match match = matchRepository.findById(matchId)
//                .orElseThrow(() -> new IllegalArgumentException("Match not found"));
//
//        Bet bet = new Bet();
//        bet.setUser(user);
//        bet.setMatch(match);
//        bet.setHomeScore(homeScore);
//        bet.setAwayScore(awayScore);
//        bet.setIsCorrect(false);
//        bet.setCreatedAt(LocalDateTime.now());
//
//        return betRepository.save(bet);
//    }

    //  PRAWIE DZIALA(NIE DODAJE BETA)
//    public ResponseEntity<?> placeBet(BetRequest request) {
//        if (betRepository.existsByUserIdAndMatchId(request.getUserId(), request.getMatchId())) {
//            throw new IllegalArgumentException("User has already placed a bet for this match.");
//        }
//
//        User user = userRepository.findById(request.getUserId())
//                .orElseThrow(() -> new IllegalArgumentException("User not found"));
//        Match match = matchRepository.findById(request.getMatchId())
//                .orElseThrow(() -> new IllegalArgumentException("Match not found"));
//
//        Bet bet = new Bet();
//        bet.setUser(user);
//        bet.setMatch(match);
//        bet.setHomeScore(request.getHomeScore());
//        bet.setAwayScore(request.getAwayScore());
//        bet.setIsCorrect(false);
//        bet.setCreatedAt(LocalDateTime.now());
//
//        betRepository.save(bet);
//        return ResponseEntity.ok("Bet added successfully");
//    }
    public void placeBet(String username, Long matchId, int homeScore, int awayScore) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found"));

        if (betRepository.existsByUserAndMatch(user, match)) {
            throw new IllegalArgumentException("Bet already exists for this user and match");
        }

        Bet bet = new Bet();
        bet.setUser(user);
        bet.setMatch(match);
        bet.setHomeScore(homeScore);
        bet.setAwayScore(awayScore);
        bet.setIsCorrect(false);

        betRepository.save(bet);
    }


    //    @PostMapping("/add")
//    public ResponseEntity<?> addBet(@RequestBody BetRequest request) {
//        Long userId = payload.get("userId");
//        Long matchId = payload.get("matchId");
//
//        Bet bet = new Bet();
//        betService.addBet(bet, userId, matchId);
//        return ResponseEntity.ok("Bet added successfully");
//    }
    @Transactional
    public ResponseEntity<?> addBet(BetRequest request) {
        User user = userRepository.findById(request.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        Match match = matchRepository.findById(request.getMatchId()).orElseThrow(() -> new RuntimeException("Match not found"));

        if (betRepository.existsByUserAndMatch(user, match)) {
            throw new IllegalArgumentException("Bet already exists for this user and match");
        }

        if (LocalDateTime.now().isAfter(match.getDateTime())) {
            throw new IllegalArgumentException("Cannot place a bet after the match has started.");
        }

        Bet bet = new Bet();
        bet.setUser(user);
        bet.setMatch(match);
        bet.setHomeScore(request.getHomeScore());
        bet.setAwayScore(request.getAwayScore());

        betRepository.save(bet);

        notificationService.createBetNotification(user, match);

        return ResponseEntity.ok("Bet added successfully");
    }


    public void checkBetsForMatch(Long matchId, int actualHomeScore, int actualAwayScore) {
        List<Bet> bets = betRepository.findByMatchId(matchId);
        for (Bet bet : bets) {
            boolean isCorrect = bet.getHomeScore() == actualHomeScore && bet.getAwayScore() == actualAwayScore;
            bet.setIsCorrect(isCorrect);
            betRepository.save(bet);
        }
    }

    public int getUserPoints(Long userId) {
        return betRepository.countByUserIdAndIsCorrectTrue(userId);
    }


    //  WSTAWIC DO MECZU, JESLI SIE SKONCZY
    public void checkBetResults(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found"));
        ///////
        System.out.println("Match status from database: " + match.getStatus());

        //if (!match.getStatus().equals("FINISHED")) {
        if (!match.getStatus().equals(MatchStatus.FINISHED)) {
            throw new IllegalStateException("Match is not finished yet");
        }

        List<Bet> bets = betRepository.findByMatchId(matchId);
        for (Bet bet : bets) {
            if (bet.getHomeScore() == match.getHomeGoals() && bet.getAwayScore() == match.getAwayGoals()) {
                bet.setIsCorrect(true);

                User user = bet.getUser();

//                // Znajdź lub utwórz punkty w tabeli RankingPoints
//                RankingPoints rankingPoints = rankingPointsRepository.findByUserIdAndRankingId(user.getId(), activeRanking)
//                    .orElseGet(() -> {
//                        RankingPoints newRankingPoints = new RankingPoints();
//                        newRankingPoints.setUser(user);
//                        newRankingPoints.setRanking(activeRanking);
//                        newRankingPoints.setPoints(0);
//                        newRankingPoints.setLastUpdated(LocalDateTime.now());
//                        return newRankingPoints;
//                    });
//                // Zaktualizuj punkty w rankingu
//                rankingPoints.setPoints(rankingPoints.getPoints() + 1);
//                rankingPoints.setLastUpdated(LocalDateTime.now());
//                rankingPointsRepository.save(rankingPoints);

                notificationService.createCorrectBetNotification(user, match);

                rankingPointsService.updateRankingPoints(bet.getUser().getId(), 1);

//                User user = bet.getUser();
//                user.setPoints(user.getPoints() + 1);
//                userRepository.save(user);
            } else {
                bet.setIsCorrect(false);
                User user = bet.getUser();
                notificationService.createIncorrectBetNotification(user, match);
            }
            betRepository.save(bet);
        }
    }


    public List<Bet> getAllBets() {
        return betRepository.findAll();
    }

    public Bet getBetById(Long id) {
        return betRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bet not found with id: " + id));
    }

    public void deleteBet(Long id) {
        betRepository.deleteById(id);
    }

    public List<Bet> getUserBets(Long userId) {
        return betRepository.findByUserId(userId);
    }
}
