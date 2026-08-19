package pl.pollub.footballapp.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.Match;
import pl.pollub.footballapp.model.MatchSquad;
import pl.pollub.footballapp.model.Player;
import pl.pollub.footballapp.repository.MatchRepository;
import pl.pollub.footballapp.repository.MatchSquadRepository;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.pollub.footballapp.repository.PlayerRepository;
import pl.pollub.footballapp.requests.MatchSquadRequest;

@Service
public class MatchSquadService {
    private final MatchSquadRepository matchSquadRepository;
    private final MatchRepository matchRepository;
    private final PlayerRepository playerRepository;
    private static final Logger logger = LoggerFactory.getLogger(MatchSquadService.class);

    @Autowired
    public MatchSquadService(MatchSquadRepository matchSquadRepository, MatchRepository matchRepository, PlayerRepository playerRepository) {
        this.matchSquadRepository = matchSquadRepository;
        this.matchRepository = matchRepository;
        this.playerRepository = playerRepository;
    }


    @Transactional
    public MatchSquad createMatchSquad(MatchSquadRequest request) {
        Match match = matchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new IllegalArgumentException("Match not found for ID: " + request.getMatchId()));

        Player player = playerRepository.findById(request.getPlayerId())
                .orElseThrow(() -> new IllegalArgumentException("Player not found for ID: " + request.getPlayerId()));

        MatchSquad matchSquad = new MatchSquad();
        matchSquad.setMatch(match);
        matchSquad.setPlayer(player);
        matchSquad.setHomeTeam(request.getHomeTeam());
        matchSquad.setFirstSquad(request.getFirstSquad());

        return matchSquadRepository.save(matchSquad);
    }

    public MatchSquad addMatchSquad(MatchSquad matchSquad) {
        return matchSquadRepository.save(matchSquad);
    }

    public List<MatchSquad> getAllMatchSquads() {
        return matchSquadRepository.findAll();
    }

    public Optional<MatchSquad> getMatchSquadById(Long id) {
        return matchSquadRepository.findById(id);
    }

    public void deleteMatchSquad(Long id) {
        matchSquadRepository.deleteById(id);
    }

    public List<Player> getPlayersByMatchId(Long matchId) {
        logger.debug("Fetching players for matchId: {}", matchId);
        List<Player> players = matchSquadRepository.findPlayersByMatchId(matchId);
        logger.debug("Found players: {}", players);
        return matchSquadRepository.findPlayersByMatchId(matchId);
    }

    public List<Player> getFirstSquadPlayers(Long matchId) {
        return matchSquadRepository.findFirstSquadPlayersByMatchId(matchId);
    }

    public List<Player> getSubstitutePlayers(Long matchId) {
        return matchSquadRepository.findSubstitutePlayersByMatchId(matchId);
    }

    // Nowa metoda do pobierania pierwszej jedenastki z uwzględnieniem homeTeam
    public List<Player> getFirstSquadPlayersByHomeTeam(Long matchId, boolean homeTeam) {
        return matchSquadRepository.findFirstSquadPlayersByMatchIdAndHomeTeam(matchId, homeTeam);
    }

    // Nowa metoda do pobierania rezerwowych z uwzględnieniem homeTeam
    public List<Player> getSubstitutePlayersByHomeTeam(Long matchId, boolean homeTeam) {
        return matchSquadRepository.findSubstitutePlayersByMatchIdAndHomeTeam(matchId, homeTeam);
    }
}
