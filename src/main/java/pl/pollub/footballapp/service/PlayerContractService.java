package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.TransferType;
import pl.pollub.footballapp.model.Player;
import pl.pollub.footballapp.model.PlayerContract;
import pl.pollub.footballapp.model.Team;
import pl.pollub.footballapp.repository.PlayerContractRepository;
import pl.pollub.footballapp.repository.PlayerRepository;
import pl.pollub.footballapp.repository.TeamRepository;
import pl.pollub.footballapp.requests.PlayerContractRequest;

import java.sql.SQLOutput;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlayerContractService {
    private PlayerContractRepository playerContractRepository;
    private PlayerRepository playerRepository;
    private TeamRepository teamRepository;

    @Autowired
    public PlayerContractService(PlayerContractRepository playerContractRepository, PlayerRepository playerRepository, TeamRepository teamRepository) {
        this.playerContractRepository = playerContractRepository;
        this.playerRepository = playerRepository;
        this.teamRepository = teamRepository;
    }


    public List<PlayerContract> getAllTransfers() {
        return playerContractRepository.findAll(Sort.by(Sort.Direction.DESC, "startDate"));
    }


    public ResponseEntity<?> addPlayerContract(PlayerContractRequest request) {
        boolean hasActiveContract = playerContractRepository.existsByPlayerIdAndIsActive(request.getPlayerId(), true);

        if (hasActiveContract) {
            return ResponseEntity.badRequest().body("Player already has an active contract.");
        }

        boolean overlappingContractExists = playerContractRepository.findByPlayerId(request.getPlayerId())
                .stream()
                .anyMatch(contract -> (request.getStartDate().isBefore(contract.getEndDate()) || contract.getEndDate() == null)
                        && (request.getEndDate() == null || request.getEndDate().isAfter(contract.getStartDate())));

        if (overlappingContractExists) {
            return ResponseEntity.badRequest().body("Cannot add contract. A contract already exists for the specified date range.");
        }

        Player player = playerRepository.findById(request.getPlayerId())
                .orElseThrow(() -> new IllegalArgumentException("Player not found with id: " + request.getPlayerId()));

        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new IllegalArgumentException("Team not found with id: " + request.getTeamId()));

        PlayerContract playerContract = new PlayerContract();
        playerContract.setStartDate(request.getStartDate());
        playerContract.setEndDate(request.getEndDate());
        playerContract.setPlayer(player);
        playerContract.setTeam(team);
        playerContract.setSalary(request.getSalary());
        playerContract.setTransferType(request.getTransferType());

        if (request.getTransferType() == TransferType.TRANSFER) {
            playerContract.setTransferFee(request.getTransferFee());
        } else {
            playerContract.setTransferFee(null);
        }

        boolean isActive = request.getEndDate() == null || request.getEndDate().isAfter(LocalDate.now());
        playerContract.setIsActive(isActive);  // Assuming there's a setter or field for isActive in PlayerContract

        // Set the player's team if the contract is active
        if (isActive) {
            System.out.println("***** USTAWIANIE NOWEJ DRUZYNY *****");
            player.setTeam(team);
            playerRepository.save(player);  // Save the updated player with the new team
        }

        playerContractRepository.save(playerContract);
        return ResponseEntity.ok("Player contract added successfully");
    }


    public List<PlayerContract> getContractsByPlayer(Long playerId) {
        return playerContractRepository.findByPlayerId(playerId);
    }

    public List<PlayerContract> getContractsByTeam(Long teamId) {
        return playerContractRepository.findByTeamId(teamId);
    }

    public ResponseEntity<PlayerContract> getPlayerContractById(Long id) {
        PlayerContract playerContract = playerContractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        return ResponseEntity.ok(playerContract);
    }

    public ResponseEntity<PlayerContract> editPlayerContract(Long id, PlayerContractRequest request) {
        PlayerContract playerContract = playerContractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        Player player = playerRepository.findById(playerContract.getPlayer().getId())
                .orElseThrow(() -> new RuntimeException("Player not found"));

//        Team team = teamRepository.findById(request.getTeamId())
//                .orElseThrow(() -> new RuntimeException("Team not found"));
        Team team = teamRepository.findById(playerContract.getTeam().getId())
                .orElseThrow(() -> new RuntimeException("Team not found"));

        // Update the contract fields
        playerContract.setPlayer(player);
        playerContract.setTeam(team);
        playerContract.setStartDate(request.getStartDate());
        playerContract.setEndDate(request.getEndDate());
        playerContract.setSalary(request.getSalary());
        playerContract.setTransferFee(request.getTransferFee());
        playerContract.setTransferType(request.getTransferType());

        boolean isActive = request.getEndDate() == null || request.getEndDate().isAfter(LocalDate.now());
        playerContract.setIsActive(isActive);  // Assuming there's a setter or field for isActive in PlayerContract

        // Set the player's team if the contract is active
        if (isActive) {
            player.setTeam(team);
        } else {
            player.setTeam(null); // Clear the player's team if the contract is no longer active
        }

        // Save the updated player and contract
        playerRepository.save(player);
        PlayerContract updatedContract = playerContractRepository.save(playerContract);

        return ResponseEntity.ok(updatedContract);
    }

    public void deletePlayerContract(Long id) {
        if (!playerContractRepository.existsById(id)) {
            throw new IllegalArgumentException("Contract not found with ID: " + id);
        }
        playerContractRepository.deleteById(id);
    }

    //    public List<Player> getActivePlayersByTeam(Long teamId) {
//        return playerContractRepository.findByTeamIdAndIsActiveTrue(teamId)
//                .stream()
//                .map(PlayerContract::getPlayer)
//                .collect(Collectors.toList());
//    }
    public List<Player> getActivePlayersByTeam(Long teamId) {
        return playerContractRepository.findByTeamIdAndIsActiveTrue(teamId)
                .stream()
                .map(PlayerContract::getPlayer)
                .collect(Collectors.toList());
    }

}
