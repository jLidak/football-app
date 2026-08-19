package pl.pollub.footballapp.controller;

import jakarta.annotation.security.PermitAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.EventType;
import pl.pollub.footballapp.model.Event;
import pl.pollub.footballapp.requests.EventRequest;
import pl.pollub.footballapp.service.EventService;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {
    private final EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }


    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<Event> addEvent(@RequestBody EventRequest eventRequest) {
        System.out.println("Received EventRequest: " + eventRequest);
        System.out.println("MatchID:" + eventRequest.getMatchId());
        return ResponseEntity.ok(eventService.addEvent(eventRequest));
    }

    @GetMapping("/match/{matchId}")
    @PermitAll
    public ResponseEntity<List<Event>> getEventsForMatch(@PathVariable Long matchId) {

        return ResponseEntity.ok(eventService.getEventsForMatch(matchId));
    }

    @DeleteMapping("/{eventId}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/types")
    @PermitAll
    public List<EventType> getEventTypes() {
        return Arrays.asList(EventType.values());
    }

    @PostMapping("/add-batch")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<List<Event>> addEvents(@RequestBody List<EventRequest> eventRequests) {
        List<Event> savedEvents = eventRequests.stream()
                .map(eventService::addEvent)
                .toList();
        return ResponseEntity.ok(savedEvents);
    }

}
