package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.EventType;
import pl.pollub.footballapp.MatchStatus;
import pl.pollub.footballapp.model.*;
import pl.pollub.footballapp.repository.EventRepository;
import pl.pollub.footballapp.repository.MatchRepository;
import pl.pollub.footballapp.repository.MatchSquadRepository;
import pl.pollub.footballapp.repository.PlayerRepository;
import pl.pollub.footballapp.requests.EventRequest;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final MatchRepository matchRepository;
    private final PlayerRepository playerRepository;
    private MatchSquadRepository matchSquadRepository;

    @Autowired
    private LeagueService leagueService;

    @Autowired
    public EventService(EventRepository eventRepository, MatchRepository matchRepository, PlayerRepository playerRepository, MatchSquadRepository matchSquadRepository) {
        this.eventRepository = eventRepository;
        this.matchRepository = matchRepository;
        this.playerRepository = playerRepository;
        this.matchSquadRepository = matchSquadRepository;
    }


    public Event addEvent(EventRequest eventRequest) {
        Event event = new Event();

        // Logowanie wartości
        System.out.println("Received EventRequest: " + eventRequest);

        // Pobranie meczu
        Match match = matchRepository.findById(eventRequest.getMatchId())
                .orElseThrow(() -> new IllegalArgumentException("Match not found for ID: " + eventRequest.getMatchId()));
        event.setMatch(match);

        // Pobranie gracza (opcjonalnie)
        if (eventRequest.getPlayerId() != null) {
            Player player = playerRepository.findById(eventRequest.getPlayerId())
                    .orElseThrow(() -> new IllegalArgumentException("Player not found for ID: " + eventRequest.getPlayerId()));
            event.setPlayer(player);
        }

        // Ustawienie pozostałych pól
        event.setMinute(eventRequest.getMinute());
        event.setType(eventRequest.getType());
        event.setPartOfGame(eventRequest.getPartOfGame());
        if (eventRequest.getDateTime() != null) {
            System.out.println("Using provided dateTime: " + eventRequest.getDateTime());
            event.setDateTime(eventRequest.getDateTime());
        } else {
            System.out.println("Using default match dateTime: " + match.getDateTime());
            event.setDateTime(match.getDateTime());
        }
        // Logika biznesowa
        switch (event.getType()) {
            case GOAL:
            case FREE_KICK:
            case PENALTY:
                if (!event.getPartOfGame().equals("PENALTIES")) {
                    if (event.getPlayer() != null && event.getPlayer().getTeam().equals(match.getHomeTeam())) {
                        match.setHomeGoals(match.getHomeGoals() + 1);
                    } else if (event.getPlayer() != null) {
                        match.setAwayGoals(match.getAwayGoals() + 1);
                    }
                }
                break;

            case SHOT_ON_GOAL:
                if (event.getPlayer() != null && event.getPlayer().getTeam().equals(match.getHomeTeam())) {
                    match.setHomeShotsOnGoal(match.getHomeShotsOnGoal() + 1);
                    match.setHomeShots(match.getHomeShots() + 1);
                } else if (event.getPlayer() != null) {
                    match.setAwayShotsOnGoal(match.getAwayShotsOnGoal() + 1);
                    match.setAwayShots(match.getAwayShots() + 1);
                }
                break;

            case SHOT_MISSED:
                if (event.getPlayer() != null && event.getPlayer().getTeam().equals(match.getHomeTeam())) {
                    match.setHomeShots(match.getHomeShots() + 1);
                } else if (event.getPlayer() != null) {
                    match.setAwayShots(match.getAwayShots() + 1);
                }
                break;

            case ACCURATE_PASS:
                if (event.getPlayer() != null && event.getPlayer().getTeam().equals(match.getHomeTeam())) {
                    match.setHomePasses(match.getHomePasses() + 1);
                    match.setHomeAccuratePasses(match.getHomeAccuratePasses() + 1);
                } else if (event.getPlayer() != null) {
                    match.setAwayPasses(match.getAwayPasses() + 1);
                    match.setAwayAccuratePasses(match.getAwayAccuratePasses() + 1);
                }
                break;

            case MISSED_PASS:
                if (event.getPlayer() != null && event.getPlayer().getTeam().equals(match.getHomeTeam())) {
                    match.setHomePasses(match.getHomePasses() + 1);
                } else if (event.getPlayer() != null) {
                    match.setAwayPasses(match.getAwayPasses() + 1);
                }
                break;

            case OFFSIDE:
                if (event.getPlayer() != null && event.getPlayer().getTeam().equals(match.getHomeTeam())) {
                    match.setHomeOffside(match.getHomeOffside() + 1);
                } else if (event.getPlayer() != null) {
                    match.setAwayOffside(match.getAwayOffside() + 1);
                }
                break;

            case MATCH_START:
                match.setStatus(MatchStatus.IN_PLAY);
                break;

            case MATCH_END:
                match.setStatus(MatchStatus.FINISHED);
                match.setDuration(calculateMatchDurationFromEvents(eventRepository.findByMatchId(match.getId())));
                calculateMinutesPlayed(match.getId());
                break;

            case SUB_IN:
                Event subOffEvent = new Event();
                subOffEvent.setMatch(event.getMatch());
                subOffEvent.setMinute(event.getMinute());
                subOffEvent.setType(EventType.SUB_OFF);
                subOffEvent.setPartOfGame(event.getPartOfGame());
                eventRepository.save(subOffEvent);
                break;

            case YELLOW_CARD:
                long yellowCardCount = eventRepository.findByMatchId(match.getId()).stream()
                        .filter(e -> e.getType() == EventType.YELLOW_CARD &&
                                e.getPlayer() != null &&
                                e.getPlayer().getId().equals(event.getPlayer().getId()))
                        .count();

                if (yellowCardCount >= 1) {
                    Event redCardEvent = new Event();
                    redCardEvent.setMatch(match);
                    redCardEvent.setPlayer(event.getPlayer());
                    redCardEvent.setMinute(event.getMinute());
                    redCardEvent.setType(EventType.RED_CARD);
                    redCardEvent.setPartOfGame(event.getPartOfGame());
                    eventRepository.save(redCardEvent);
                    System.out.println("Added RED_CARD for player " + event.getPlayer().getId() + " due to second yellow card.");
                }
                break;
        }

        matchRepository.save(match);
        return eventRepository.save(event);
    }

    private int calculateMatchDuration(Long matchId) {
        List<Event> events = eventRepository.findByMatchId(matchId);
        int duration = 0;

        for (Event event : events) {
            if (event.getType() == EventType.FIRST_HALF_END ||
                    event.getType() == EventType.SECOND_HALF_END ||
                    event.getType() == EventType.OT_FIRST_HALF_END ||
                    event.getType() == EventType.OT_SECOND_HALF_END) {
                duration += event.getMinute();
            }
        }
        return duration;
    }

    public List<Event> getEventsForMatch(Long matchId) {
        return eventRepository.findByMatchId(matchId);
    }

    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }


    public void calculateMinutesPlayed(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found for ID: " + matchId));
        List<Event> events = eventRepository.findByMatchId(matchId);

        // Obliczenie czasu zakończenia poszczególnych części meczu
        int firstHalfEnd = events.stream()
                .filter(event -> event.getType() == EventType.FIRST_HALF_END)
                .map(Event::getMinute)
                .findFirst()
                .orElse(45);

        int secondHalfEnd = events.stream()
                .filter(event -> event.getType() == EventType.SECOND_HALF_END)
                .map(Event::getMinute)
                .findFirst()
                .orElse(90);

        int otFirstHalfEnd = events.stream()
                .filter(event -> event.getType() == EventType.OT_FIRST_HALF_END)
                .map(Event::getMinute)
                .findFirst()
                .orElse(0);

        int otSecondHalfEnd = events.stream()
                .filter(event -> event.getType() == EventType.OT_SECOND_HALF_END)
                .map(Event::getMinute)
                .findFirst()
                .orElse(0);

        int matchDuration = firstHalfEnd + secondHalfEnd + otFirstHalfEnd + otSecondHalfEnd;

        List<MatchSquad> matchSquads = matchSquadRepository.findByMatchId(matchId);

        for (MatchSquad squad : matchSquads) {
            int minutesPlayed = 0;

            // Sprawdź, czy zawodnik jest w pierwszym składzie
            Optional<Event> subOffEvent = events.stream()
                    .filter(event -> event.getType() == EventType.SUB_OFF &&
                            event.getPlayer() != null &&
                            event.getPlayer().getId().equals(squad.getPlayer().getId()))
                    .findFirst();

            Optional<Event> subInEvent = events.stream()
                    .filter(event -> event.getType() == EventType.SUB_IN &&
                            event.getPlayer() != null &&
                            event.getPlayer().getId().equals(squad.getPlayer().getId()))
                    .findFirst();

            if (subOffEvent.isPresent()) {
                // Zawodnik schodzący
                Event subOff = subOffEvent.get();
                int subOffMinute = subOff.getMinute();
                minutesPlayed = calculateMinutesUntilPart(subOff.getPartOfGame(), firstHalfEnd, secondHalfEnd, otFirstHalfEnd) + subOffMinute;
            } else if (subInEvent.isPresent()) {
                // Zawodnik wchodzący
                Event subIn = subInEvent.get();

                // Znajdź zawodnika, za którego wszedł
                Optional<Event> relatedSubOffEvent = events.stream()
                        .filter(event -> event.getType() == EventType.SUB_OFF &&
                                event.getMinute() == subIn.getMinute() &&
                                event.getPartOfGame().equals(subIn.getPartOfGame()))
                        .findFirst();

                if (relatedSubOffEvent.isPresent()) {
                    int subOffMinute = relatedSubOffEvent.get().getMinute();
                    minutesPlayed = matchDuration - calculateMinutesUntilPart(relatedSubOffEvent.get().getPartOfGame(), firstHalfEnd, secondHalfEnd, otFirstHalfEnd) - subOffMinute;
                } else {
                    // Jeśli brak zdarzenia SUB_OFF, licz od momentu wejścia do końca meczu
                    int subInMinute = subIn.getMinute();
                    minutesPlayed = matchDuration - calculateMinutesUntilPart(subIn.getPartOfGame(), firstHalfEnd, secondHalfEnd, otFirstHalfEnd) - subInMinute;
                }
            } else {
                // Zawodnik grający od początku do końca meczu
                minutesPlayed = matchDuration;
            }

            // Aktualizacja czasu gry
            squad.setMinutesPlayed(minutesPlayed);
            matchSquadRepository.save(squad);
        }
    }

    private int calculateMinutesUntilPart(String partOfGame, int firstHalfEnd, int secondHalfEnd, int otFirstHalfEnd) {
        switch (partOfGame) {
            case "FIRST_HALF":
                return 0;
            case "SECOND_HALF":
                return firstHalfEnd;
            case "OT_FIRST_HALF":
                return firstHalfEnd + secondHalfEnd;
            case "OT_SECOND_HALF":
                return firstHalfEnd + secondHalfEnd + otFirstHalfEnd;
            default:
                return 0;
        }
    }


    // Metoda obliczająca całkowity czas meczu
    public int calculateMatchDurationFromEvents(List<Event> events) {
        int firstHalfEnd = events.stream()
                .filter(event -> event.getType() == EventType.FIRST_HALF_END)
                .map(Event::getMinute)
                .findFirst()
                .orElse(0);
        int secondHalfEnd = events.stream()
                .filter(event -> event.getType() == EventType.SECOND_HALF_END)
                .map(Event::getMinute)
                .findFirst()
                .orElse(0);
        int otFirstHalfEnd = events.stream()
                .filter(event -> event.getType() == EventType.OT_FIRST_HALF_END)
                .map(Event::getMinute)
                .findFirst()
                .orElse(0);
        int otSecondHalfEnd = events.stream()
                .filter(event -> event.getType() == EventType.OT_SECOND_HALF_END)
                .map(Event::getMinute)
                .findFirst()
                .orElse(0);
        int matchEnd = events.stream()
                .filter(event -> event.getType() == EventType.MATCH_END)
                .map(Event::getMinute)
                .findFirst()
                .orElse(Math.max(secondHalfEnd, otSecondHalfEnd));

        return firstHalfEnd + secondHalfEnd + otFirstHalfEnd + otSecondHalfEnd + (matchEnd - secondHalfEnd);
    }

}
