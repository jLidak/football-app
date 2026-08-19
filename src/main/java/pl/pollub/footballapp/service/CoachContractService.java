package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.Coach;
import pl.pollub.footballapp.model.CoachContract;
import pl.pollub.footballapp.model.Team;
import pl.pollub.footballapp.repository.CoachContractRepository;
import pl.pollub.footballapp.repository.CoachRepository;
import pl.pollub.footballapp.repository.TeamRepository;
import pl.pollub.footballapp.requests.CoachContractRequest;

import java.util.List;
import java.util.Optional;

@Service
public class CoachContractService {
    private CoachContractRepository coachContractRepository;
    private CoachRepository coachRepository;
    private TeamRepository teamRepository;

    @Autowired
    public CoachContractService(CoachContractRepository coachContractRepository, CoachRepository coachRepository, TeamRepository teamRepository) {
        this.coachContractRepository = coachContractRepository;
        this.coachRepository = coachRepository;
        this.teamRepository = teamRepository;
    }


    public ResponseEntity<?> addCoachContract(CoachContractRequest request) {
        boolean hasActiveContract = coachContractRepository.existsByCoachIdAndIsActive(request.getCoachId(), true);
        if (hasActiveContract) {
            return ResponseEntity.badRequest().body("Coach already has an active contract.");
        }

        Coach coach = coachRepository.findById(request.getCoachId())
                .orElseThrow(() -> new IllegalArgumentException("Coach not found with id: " + request.getCoachId()));

        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new IllegalArgumentException("Team not found with id: " + request.getTeamId()));

        CoachContract coachContract = new CoachContract();
        coachContract.setStartDate(request.getStartDate());
        coachContract.setEndDate(request.getEndDate());
        coachContract.setCoach(coach);
        coachContract.setTeam(team);

        if (request.getSalary() != null) {
            coachContract.setSalary(request.getSalary());
        }
        if (request.getTransferFee() != null) {
            coachContract.setTransferFee(request.getTransferFee());
        }

        coachContractRepository.save(coachContract);
        return ResponseEntity.ok("Coach contract added successfully");
    }


    public List<CoachContract> getContractsByCoach(Long coachId) {
        return coachContractRepository.findByCoachId(coachId);
    }

    public List<CoachContract> getContractsByTeam(Long teamId) {
        return coachContractRepository.findByTeamId(teamId);
    }

    public ResponseEntity<CoachContract> getCoachContractById(Long id) {
        CoachContract coachContract = coachContractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        return ResponseEntity.ok(coachContract);
    }

    public ResponseEntity<CoachContract> editCoachContract(Long id, CoachContractRequest request) {
        CoachContract coachContract = coachContractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        Coach coach = coachRepository.findById(coachContract.getCoach().getId())
                .orElseThrow(() -> new RuntimeException("Coach not found"));

        Team team = teamRepository.findById(coachContract.getTeam().getId())
                .orElseThrow(() -> new RuntimeException("Team not found"));

        coachContract.setCoach(coach);
        coachContract.setTeam(team);
        coachContract.setStartDate(request.getStartDate());
        coachContract.setEndDate(request.getEndDate());

        if (request.getSalary() != null) {
            coachContract.setSalary(request.getSalary());
        }
        if (request.getTransferFee() != null) {
            coachContract.setTransferFee(request.getTransferFee());
        }

        CoachContract updatedContract = coachContractRepository.save(coachContract);
        return ResponseEntity.ok(updatedContract);
    }

    public ResponseEntity<?> deleteCoachContract(Long id) {
        if (!coachContractRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("Contract not found");
        }
        coachContractRepository.deleteById(id);
        return ResponseEntity.ok("Contract deleted successfully");
    }


    public Optional<CoachContract> getCurrentCoachByTeam(Long teamId) {
        return coachContractRepository.findByTeamIdAndIsActive(teamId);
    }
}
